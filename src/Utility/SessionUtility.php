<?php

namespace Wbm\TagManagerEcomm\Utility;

use Symfony\Component\HttpFoundation\Session\Session;

class SessionUtility extends Session
{
    public const ATTRIBUTE_NAME = 'wbm-stored-datalayer';

    public const UPDATE_FLAG = 'wbm-stored-shouldUpdate';

    public const ADDCART_UPDATEFLAG_VALUE = 'cartaddprice';
    public const ADDCART_CART_ITEMS = 'wbm-stored-addCart-addedCartItems';

    public function injectSessionVars(array $dataLayer): array
    {
        if (!$this->has(self::UPDATE_FLAG)) {
            return $dataLayer;
        }

        if ($this->get(self::UPDATE_FLAG) === self::ADDCART_UPDATEFLAG_VALUE) {
            try {
                foreach ($dataLayer as &$dLayer) {
                    $dLayer = json_decode($dLayer, true, 512, JSON_THROW_ON_ERROR);
                    foreach ($dLayer['ecommerce']['add']['products'] as &$product) {
                        $lineItems = $this->get(self::ADDCART_CART_ITEMS);
                        $product['price'] = $lineItems[$product['id']];
                    }
                    unset($product);
                    $dLayer = json_encode($dLayer);
                }
            } catch (\Throwable $t) {
                // just to make sure session vars are removed on error
            }
            $this->remove(self::UPDATE_FLAG);
            $this->remove(self::ADDCART_CART_ITEMS);
        }

        return $dataLayer;
    }
}
