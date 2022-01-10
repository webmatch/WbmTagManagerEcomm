<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Subscriber;

use Shopware\Storefront\Event\StorefrontRenderEvent;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Session\SessionInterface;
use Wbm\TagManagerEcomm\Cookie\CustomCookieProvider;
use Wbm\TagManagerEcomm\Services\DataLayerModules;
use Wbm\TagManagerEcomm\Services\DataLayerRenderer;
use Wbm\TagManagerEcomm\Utility\SessionUtility;

class StorefrontRenderSubscriber implements EventSubscriberInterface
{
    /**
     * @var DataLayerModules
     */
    private $modules;

    /**
     * @var DataLayerRenderer
     */
    private $dataLayerRenderer;

    /**
     * @var SessionInterface
     */
    private $session;

    public function __construct(
        DataLayerModules $modules,
        DataLayerRenderer $dataLayerRenderer,
        SessionInterface $session
    ) {
        $this->modules = $modules;
        $this->dataLayerRenderer = $dataLayerRenderer;
        $this->session = $session;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            StorefrontRenderEvent::class => 'onRender',
        ];
    }

    public function onRender(StorefrontRenderEvent $event): void
    {
        $salesChannelId = $event->getSalesChannelContext()->getSalesChannel()->getId();
        $containerId = $this->modules->getContainerId($salesChannelId);
        $isActive = !empty($containerId) && $this->modules->isActive($salesChannelId);
        $route = $event->getRequest()->attributes->get('_route');

        if (!$isActive) {
            return;
        }

        if ($this->session->has(SessionUtility::ATTRIBUTE_NAME)) {
            if (in_array($route, $this->modules->getResponseRoutes(), true)) {
                $dataLayer = json_decode($this->session->get(SessionUtility::ATTRIBUTE_NAME), true);
            }
        } else {
            $parameters = $event->getParameters();
            $modules = $this->modules->getModules();

            if (array_key_exists($route, $modules)) {
                $dataLayer = $this->dataLayerRenderer->setVariables($route, $parameters)->renderDataLayer($route);
                $dataLayer = $dataLayer->getDataLayer($route);
            }
        }

        if (!$event->getRequest()->isXmlHttpRequest()) {
            $event->setParameter(
                'wbmTagManagerConfig',
                [
                    'gtmContainerId' => $containerId,
                    'isTrackingProductClicks' => $this->modules->isTrackingProductClicks($salesChannelId),
                    'wbmCookieEnabledName' => CustomCookieProvider::WBM_GTM_ENABLED_COOKIE_NAME,
                    'hasSWConsentSupport' => $this->modules->hasSWConsentSupport($salesChannelId),
                    'scriptTagAttributes' => $this->modules->getScriptTagAttributes($salesChannelId),
                    'dataLayerScriptTagAttributes' => $this->modules->getDataLayerScriptTagAttributes($salesChannelId),
                    'extendedUrlParameter' => $this->modules->getExtendedURLParameter($salesChannelId),
                    'gtmFunctionOverwrite' => $this->modules->getGtmFunctionOverwrite($salesChannelId)
                ]
            );

            if (!empty($dataLayer)) {
                $event->setParameter(
                    'dataLayer',
                    $dataLayer['default']
                );
                if (array_key_exists('onEvent', $dataLayer)) {
                    $event->setParameter(
                        'onEvent',
                        $dataLayer['onEvent']
                    );
                }
            }
        }
    }
}
