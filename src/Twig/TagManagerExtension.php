<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Twig;

use Doctrine\DBAL\Connection;
use Shopware\Core\Checkout\Cart\CartBehavior;
use Shopware\Core\Checkout\Cart\CartRuleLoader;
use Shopware\Core\Checkout\Cart\LineItem\LineItem;
use Shopware\Core\Checkout\Cart\SalesChannel\CartService;
use Shopware\Core\Content\Property\Aggregate\PropertyGroupOption\PropertyGroupOptionEntity;
use Shopware\Core\Framework\Uuid\Uuid;
use Shopware\Core\Kernel;
use Shopware\Core\PlatformRequest;
use Shopware\Core\System\SalesChannel\Context\SalesChannelContextServiceInterface;
use Shopware\Core\System\SalesChannel\SalesChannelContext;
use Symfony\Component\HttpFoundation\RequestStack;
use Twig\Extension\AbstractExtension;
use Twig\TwigFilter;
use Twig\TwigFunction;
use Wbm\TagManagerEcomm\Utility\SessionUtility;

class TagManagerExtension extends AbstractExtension
{
    /**
     * @var Connection
     */
    private $connection;

    /**
     * @var CartService
     */
    private $cartService;

    /**
     * @var CartRuleLoader
     */
    private $cartRuleLoader;

    /**
     * @var SalesChannelContextServiceInterface
     */
    private $salesChannelContextService;

    /**
     * @var RequestStack
     */
    private $requestStack;

    /**
     * @var array
     */
    private $_cache = [];

    public function __construct(
        Connection $connection,
        CartService $cartService,
        CartRuleLoader $cartRuleLoader,
        SalesChannelContextServiceInterface $salesChannelContextService,
        RequestStack $requestStack
    ) {
        $this->connection = $connection;
        $this->cartService = $cartService;
        $this->cartRuleLoader = $cartRuleLoader;
        $this->salesChannelContextService = $salesChannelContextService;
        $this->requestStack = $requestStack;
    }

    public function getFunctions(): array
    {
        return [
            new TwigFunction('dbquery', [$this, 'dbquery']),
            new TwigFunction('cartaddprice', [$this, 'cartaddprice'], ['needs_context' => true]),
            new TwigFunction('cartremoveprice', [$this, 'cartremoveprice'], ['needs_context' => true]),
            new TwigFunction('languageid', [$this, 'languageid'], ['needs_context' => true]),
            new TwigFunction('currencyiso', [$this, 'currencyiso'], ['needs_context' => true]),
            new TwigFunction('getvariantdescription', [$this, 'getvariantdescription'], ['needs_context' => true]),
            new TwigFunction('getparam', [$this, 'getparam']),
        ];
    }

    public function getFilters(): array
    {
        return [
            new TwigFilter('uuid2bytes', [$this, 'uuid2bytes']),
        ];
    }

    public function dbquery(
        string $select = '',
        string $from = '',
        array $where = [],
        array $order = []
    ): string {
        if (
            empty($select)
            || empty($from)
        ) {
            return '';
        }

        $hash = md5(serialize([$select, $from, $where, $order]));

        if (isset($this->_cache[$hash])) {
            return (string) $this->_cache[$hash];
        }

        $qb = $this->connection->createQueryBuilder();

        $qb->select($select)
            ->from($from);

        if (is_array($where)) {
            foreach ($where as $column => $value) {
                $qb->andWhere(
                    sprintf(
                        '%s %s',
                        $column,
                        $qb->createNamedParameter($value)
                    )
                );
            }
        }

        if (is_array($order)) {
            foreach ($order as $column => $sort) {
                $qb->addOrderBy($column, $sort);
            }
        }

        try {
            $value = $qb->execute()->fetch(\PDO::FETCH_COLUMN);
            $this->_cache[$hash] = $value;

            return (string) $value;
        } catch (\Exception $exception) {
            return $exception->getMessage();
        }
    }

    public function uuid2bytes(?string $uuid = ''): string
    {
        if ($uuid) {
            return Uuid::fromHexToBytes($uuid);
        }

        return '';
    }

    public function languageid($twigContext): string
    {
        $context = $this->getSalesChannelContext($twigContext)->getContext();

        return $this->uuid2bytes($context->getLanguageId());
    }

    public function currencyiso($twigContext)
    {
        $salesChannelContext = $this->getSalesChannelContext($twigContext);

        return $salesChannelContext->getCurrency()->getIsoCode();
    }

    public function cartaddprice(): int
    {
        $session = $this->requestStack->getMasterRequest()->getSession();
        $session->set(SessionUtility::UPDATE_FLAG, SessionUtility::ADDCART_UPDATEFLAG_VALUE);
        // price will be saved to session in "Subscriber/AddToCart/AfterLineItemAddedSubscriber"
        // and before passing it to FE the correct price will be injected into datalayer

        return 0;
    }

    public function cartremoveprice(
        $twigContext,
        string $uuid = '',
        $returnQuantity = false
    ): float {
        $salesChannelContext = $this->getSalesChannelContext($twigContext);

        $cart = $this->cartService->getCart($salesChannelContext->getToken(), $salesChannelContext);

        $lineItem = $cart->getLineItems()->get($uuid);

        if ($lineItem && $lineItem->getId() === $uuid) {
            if ($returnQuantity) {
                return (float) $lineItem->getQuantity();
            }

            return ($lineItem->getPrice() !== null) ? $lineItem->getPrice()->getUnitPrice() : 0;
        }

        return 0;
    }

    public function getvariantdescription(
        $twigContext,
        $param
    ): string {
        if (is_array($param)) {
            $optionNames = '';

            foreach ($param as $option) {
                if ($option instanceof PropertyGroupOptionEntity) {
                    $optionNames .= ';' . $option->getName();

                    continue;
                }

                $optionNames .= ';' . @$option['option'];
            }

            return ltrim($optionNames, ';');
        }

        $productId = $param;

        $query = $this->connection->createQueryBuilder();
        $query->select('option_translation.name')
            ->from('product', 'product')
            ->innerJoin(
                'product',
                'product_option',
                'product_group',
                'product_group.product_id = product.id'
            )
            ->innerJoin(
                'product_group',
                'property_group_option',
                'product_option',
                'product_group.property_group_option_id = product_option.id'
            )
            ->innerJoin(
                'product_option',
                'property_group_option_translation',
                'option_translation',
                'option_translation.property_group_option_id = product_option.id'
            )
            ->where('product.id = :id')
            ->setParameter('id', $this->uuid2bytes($productId))
            ->andWhere('product.parent_id IS NOT NULL')
            ->andWhere('product.option_ids IS NOT NULL')
            ->andWhere('option_translation.language_id = :languageId')
            ->setParameter('languageId', $this->languageid($twigContext));

        $optionNames = $query->execute()->fetchAll(\PDO::FETCH_COLUMN);

        if (is_array($optionNames)) {
            return implode(';', $optionNames);
        }

        if (!empty($optionNames)) {
            return (string) $optionNames;
        }

        return '';
    }

    public function getparam(string $param)
    {
        $parameters = array_merge(
            $this->requestStack->getCurrentRequest()->request->all(),
            $this->requestStack->getCurrentRequest()->get('_route_params')
        );

        return @$parameters[$param];
    }

    private function getSalesChannelContext($twigContext): SalesChannelContext
    {
        if (
            !array_key_exists('context', $twigContext)
            || !$twigContext['context'] instanceof SalesChannelContext
        ) {
            $masterRequest = $this->requestStack->getMasterRequest();
            $salesChannelId = $masterRequest
                ->attributes->get(PlatformRequest::ATTRIBUTE_SALES_CHANNEL_ID);
            $contextToken = $masterRequest
                ->headers->get(PlatformRequest::HEADER_CONTEXT_TOKEN);
            $languageId = $masterRequest
                ->headers->get(PlatformRequest::HEADER_LANGUAGE_ID);
            if ((float)substr(Kernel::SHOPWARE_FALLBACK_VERSION, 0,3) >= 6.4 ) {
                $parameters = new \Shopware\Core\System\SalesChannel\Context\SalesChannelContextServiceParameters(
                    $salesChannelId,
                    $contextToken,
                    $languageId
                );
                $twigContext['context'] = $this->salesChannelContextService->get($parameters);
            } else {
                $twigContext['context'] = $this->salesChannelContextService->get(
                    $salesChannelId,
                    $contextToken,
                    $languageId
                );
            }
        }

        return $twigContext['context'];
    }
}
