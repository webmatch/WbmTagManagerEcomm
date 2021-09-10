<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Subscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpKernel\Event\ControllerEvent;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\KernelEvents;
use Wbm\TagManagerEcomm\Services\DataLayerModulesInterface;
use Wbm\TagManagerEcomm\Services\DataLayerRendererInterface;
use Wbm\TagManagerEcomm\Utility\SessionUtility;

class KernelEventsSubscriber implements EventSubscriberInterface
{
    /**
     * @var DataLayerModulesInterface
     */
    private $modules;

    /**
     * @var DataLayerRendererInterface
     */
    private $dataLayerRenderer;

    /**
     * @var SessionUtility
     */
    private $session;

    public function __construct(
        DataLayerModulesInterface $modules,
        DataLayerRendererInterface $dataLayerRender,
        SessionUtility $session
    ) {
        $this->modules = $modules;
        $this->dataLayerRenderer = $dataLayerRender;
        $this->session = $session;
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

        if ($isActive && !$this->session->get(SessionUtility::ATTRIBUTE_NAME)) {
            $modules = $this->modules->getModules();
            $route = $event->getRequest()->attributes->get('_route');

            if (array_key_exists($route, $modules) && !empty($modules[$route])) {
                $this->dataLayerRenderer->setVariables($route, [])->renderDataLayer($route);
            }
        }
    }

    public function prependDataLayerToResponse(ResponseEvent $event): void
    {
        $response = $event->getResponse();
        $request = $event->getRequest();
        $storedDatalayer = $this->session->get(SessionUtility::ATTRIBUTE_NAME);
        $this->session->remove(SessionUtility::ATTRIBUTE_NAME);

        $route = $event->getRequest()->attributes->get('_route');
        $dataLayer = $this->dataLayerRenderer->getDataLayer($route);
        if ($dataLayer !== null) {
            $dataLayer = $this->session->injectSessionVars($dataLayer);
            $dataLayer = json_encode($dataLayer);
        }

        if (!empty($dataLayer) && $response->isRedirect()) {
            $this->session->set(SessionUtility::ATTRIBUTE_NAME, $dataLayer);

            return;
        }

        if (!$request->isXmlHttpRequest()) {
            return;
        }

        if ($storedDatalayer && in_array($route, $this->modules->getResponseRoutes(), true)) {
            $dataLayer = $storedDatalayer;
        }

        if (empty($dataLayer)) {
            return;
        }

        $dataLayerScriptTag = sprintf(
            '<script id="wbm-data-layer">%s</script>',
            $dataLayer
        );

        $content = $dataLayerScriptTag . PHP_EOL . $response->getContent();
        $response->setContent($content);

        $event->setResponse($response);
    }
}
