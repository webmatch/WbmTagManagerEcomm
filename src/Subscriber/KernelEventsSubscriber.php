<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Subscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Wbm\TagManagerEcomm\Services\DataLayerModules;
use Wbm\TagManagerEcomm\Services\DataLayerRenderer;

class KernelEventsSubscriber implements EventSubscriberInterface
{
    const COOKIE_NAME = '_gtm_push';

    /**
     * @var DataLayerModules
     */
    private $modules;

    /**
     * @var DataLayerRenderer
     */
    private $dataLayerRenderer;

    public function __construct(
        DataLayerModules $modules,
        DataLayerRenderer $dataLayerRender
    ) {
        $this->modules = $modules;
        $this->dataLayerRenderer = $dataLayerRender;
    }

    public static function getSubscribedEvents(): array
    {
        return [
            KernelEvents::CONTROLLER => [
                ['getDataLayerForXmlHttpRequest'],
            ],
            KernelEvents::RESPONSE => [
                ['prependDataLayerToResponse'],
            ],
        ];
    }

    public function getDataLayerForXmlHttpRequest(ControllerEvent $event): void
    {
        $salesChannelId = $event->getRequest()->get('sw-sales-channel-id');
        $isActive = !empty($this->modules->getContainerId($salesChannelId)) && $this->modules->isActive($salesChannelId);

        if ($isActive && !$event->getRequest()->cookies->get(self::COOKIE_NAME)) {
            $modules = $this->modules->getModules();
            $route = $event->getRequest()->attributes->get('_route');

            if (array_key_exists($route, $modules) && !empty($modules[$route])) {
                $this->dataLayerRenderer->setVariables($route, [])
                    ->renderDataLayer($route);
            }
        }
    }

    public function prependDataLayerToResponse(ResponseEvent $event): void
    {
        $response = $event->getResponse();
        $request = $event->getRequest();
        $cookie = $request->cookies->get(self::COOKIE_NAME);
        $response->headers->clearCookie(self::COOKIE_NAME);

        $route = $event->getRequest()->attributes->get('_route');
        $dataLayer = $this->dataLayerRenderer->getDataLayer($route);

        if ($response->isRedirect() && !empty($dataLayer)) {
            $response->headers->setCookie(
                new Cookie(
                    self::COOKIE_NAME,
                    $dataLayer,
                    0,
                    '/',
                    null,
                    $request->isSecure(),
                    true,
                    false,
                    Cookie::SAMESITE_LAX
                )
            );

            return;
        }

        if (!$request->isXmlHttpRequest()) {
            return;
        }

        if ($cookie && in_array($route, $this->modules->getResponseRoutes(), true)) {
            $dataLayer = $cookie;
        }

        if (empty($dataLayer)) {
            return;
        }

        $response->headers->set(
            'Access-Control-Allow-Headers',
            $response->headers->get('Access-Control-Allow-Headers') . ',gtm-push'
        );
        $response->headers->set('gtm-push', $dataLayer);

        $event->setResponse($response);
    }
}
