<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Services;

use Doctrine\DBAL\Connection;
use Shopware\Core\System\SystemConfig\SystemConfigService;

class DataLayerModules implements DataLayerModulesInterface
{
    /**
     * @var Connection
     */
    private $connection;

    /**
     * @var SystemConfigService
     */
    private $systemConfigService;

    /**
     * @var array
     */
    private $modules;

    public function __construct(
        Connection $connection,
        SystemConfigService $systemConfigService
    ) {
        $this->connection = $connection;
        $this->systemConfigService = $systemConfigService;
    }

    public function getModules(): array
    {
        if (!empty($this->modules)) {
            return $this->modules;
        }

        $qb = $this->connection->createQueryBuilder();
        $qb->from('wbm_data_layer_modules', 'module')
            ->select(
                [
                    'module.module',
                    'module.response',
                ]
            );

        $this->modules = $qb->execute()->fetchAll(\PDO::FETCH_KEY_PAIR);

        return $this->modules;
    }

    public function getResponseRoutes(): array
    {
        $modules = [];
        foreach ($this->getModules() as $key => $module) {
            if (!empty($module)) {
                $modules = array_merge($modules, explode(',', $module));
            }
        }

        return $modules;
    }

    public function getContainerId(): ?string
    {
        return $this->systemConfigService->get('WbmTagManagerEcomm.config.containerId');
    }

    public function isActive(): ?bool
    {
        return !$this->systemConfigService->get('WbmTagManagerEcomm.config.isInactive');
    }

    public function isTrackingProductClicks(): ?bool
    {
        return $this->systemConfigService->get('WbmTagManagerEcomm.config.isTrackingProductClicks');
    }

    public function hasSWConsentSupport(): ?bool
    {
        dump($this->systemConfigService->get('WbmTagManagerEcomm.config'));
        return $this->systemConfigService->get('WbmTagManagerEcomm.config.hasSWConsentSupport');
    }

    public function getScriptTagAttributes(): string
    {
        return $this->systemConfigService->get('WbmTagManagerEcomm.config.scriptTagAttributes') ?: '';
    }

    public function getExtendedURLParameter(): string
    {
        return $this->systemConfigService->get('WbmTagManagerEcomm.config.extendedURLParameter') ?: '';
    }
}
