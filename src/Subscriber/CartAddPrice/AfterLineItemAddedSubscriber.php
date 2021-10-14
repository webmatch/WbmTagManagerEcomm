<?php

declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Subscriber\CartAddPrice;

use Shopware\Core\Checkout\Cart\Event\AfterLineItemAddedEvent;
use Shopware\Core\Checkout\Cart\LineItem\LineItem;
use Shopware\Core\Checkout\Cart\Price\Struct\CalculatedPrice;
use Shopware\Core\Content\Product\ProductEntity;
use Shopware\Core\Framework\Context;
use Shopware\Core\Framework\DataAbstractionLayer\EntityRepositoryInterface;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Criteria;
use Shopware\Core\Framework\DataAbstractionLayer\Search\Filter\EqualsFilter;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Wbm\TagManagerEcomm\Utility\SessionUtility;

class AfterLineItemAddedSubscriber implements EventSubscriberInterface
{
    /**
     * @var SessionInterface
     */
    protected $session;

    /**
     * @var EntityRepositoryInterface
     */
    protected $productRepository;

    public function __construct(SessionInterface $session, EntityRepositoryInterface $productRepository)
    {
        $this->session = $session;
        $this->productRepository = $productRepository;
    }

    public static function getSubscribedEvents()
    {
        return [
            AfterLineItemAddedEvent::class => 'onAfterLineItemAdded'
        ];
    }

    public function onAfterLineItemAdded(AfterLineItemAddedEvent $event)
    {
        if (!$this->session->has(SessionUtility::UPDATE_FLAG)
            || $this->session->get(SessionUtility::UPDATE_FLAG) !== SessionUtility::ADDCART_UPDATEFLAG_VALUE) {
            return;
        }

        $lineItems = [];
        /** @var LineItem $addedLineItem */
        foreach ($event->getLineItems() as $addedLineItem) {
            $cartLineItem = $event->getCart()->getLineItems()->get($addedLineItem->getId());
            if (!$cartLineItem instanceof LineItem || !$cartLineItem->getPrice() instanceof CalculatedPrice) {
                continue;
            }

            if (
                !empty($cartLineItem->getPayload())
                && isset($cartLineItem->getPayload()['productNumber'])
                && !empty($cartLineItem->getPayload()['productNumber'])
            ) {
                $lineItems[$cartLineItem->getPayload()['productNumber']] = $cartLineItem->getPrice()->getUnitPrice();
                continue;
            }

            // in case payload productNumber is not set, get the productNumber from DB product
            $criteria = new Criteria();
            $criteria->addFilter(new EqualsFilter('id', $addedLineItem->getId()));
            $product = $this->productRepository->search($criteria, Context::createDefaultContext())->first();

            if ($product instanceof ProductEntity) {
                $lineItems[$product->getProductNumber()] = $cartLineItem->getPrice()->getUnitPrice();
            }
        }

        $this->session->set(SessionUtility::ADDCART_CART_ITEMS, $lineItems);
    }
}
