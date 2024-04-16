<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Services;

interface DataLayerModulesInterface
{
    public function getModules(): array;

    public function getContainerId(?string $salesChannelId = null): ?string;

    public function getResponseRoutes(): array;
    
    public function isActive(?string $salesChannelId = null): ?bool;

    public function isTrackingProductClicks(?string $salesChannelId = null): ?bool;

    public function hasSWConsentSupport(?string $salesChannelId = null): int;

    public function getScriptTagAttributes(?string $salesChannelId = null): string;

    public function getExtendedURLParameter(?string $salesChannelId = null): string;
}
