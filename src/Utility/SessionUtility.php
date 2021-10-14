<?php

namespace Wbm\TagManagerEcomm\Utility;

use Symfony\Component\HttpFoundation\Session\SessionInterface;

class SessionUtility
{
    public const ATTRIBUTE_NAME = 'wbm-stored-datalayer';

    public const UPDATE_FLAG = 'wbm-stored-shouldUpdate';

    public const ADDCART_UPDATEFLAG_VALUE = 'cartaddprice';
    public const ADDCART_CART_ITEMS = 'wbm-stored-addCart-addedCartItems';

    public static function injectSessionVars(array $dataLayer, SessionInterface $session): array
    {
        if (!$session->has(self::UPDATE_FLAG)) {
            return $dataLayer;
        }

        if ($session->get(self::UPDATE_FLAG) === self::ADDCART_UPDATEFLAG_VALUE) {
            try {
                foreach ($dataLayer as &$dLayer) {
                    $dLayer = json_decode($dLayer, true, 512);
                    foreach ($dLayer['ecommerce']['add']['products'] as &$product) {
                        $lineItems = $session->get(self::ADDCART_CART_ITEMS);
                        $product['price'] = $lineItems[$product['id']];
                    }
                    unset($product);
                    $dLayer = json_encode($dLayer);
                }
            } catch (\Throwable $t) {
                // just to make sure session vars are removed on error
            }
            $session->remove(self::UPDATE_FLAG);
            $session->remove(self::ADDCART_CART_ITEMS);
        }

        return $dataLayer;
    }
}
