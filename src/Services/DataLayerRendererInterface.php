<?php declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Services;

interface DataLayerRendererInterface
{
    public function renderDataLayer(string $route): DataLayerRendererInterface;

    public function getVariables(string $route): array;

    public function setVariables(string $route, $variables): DataLayerRendererInterface;

    public function getDataLayer($route): ?string;

    public function getChildrenList($id, $module): array;
}
