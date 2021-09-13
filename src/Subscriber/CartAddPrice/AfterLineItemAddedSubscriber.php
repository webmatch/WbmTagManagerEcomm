<?php

declare(strict_types=1);

namespace Wbm\TagManagerEcomm\Subscriber\CartAddPrice;

use Shopware\Core\Checkout\Cart\Event\AfterLineItemAddedEvent;
use Shopware\Core\Checkout\Cart\LineItem\LineItem;
use Shopware\Core\Checkout\Cart\Price\Struct\CalculatedPrice;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Wbm\TagManagerEcomm\Utility\SessionUtility;

class AfterLineItemAddedSubscriber implements EventSubscriberInterface
{
    /**
     * @var SessionUtility
     */
    protected $session;

    public function __construct(SessionUtility $session)
    {
        $this->session = $session;
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

            $lineItems[$cartLineItem->getPayload()['productNumber']] = $cartLineItem->getPrice()->getUnitPrice();
        }

        $this->session->set(SessionUtility::ADDCART_CART_ITEMS, $lineItems);
    }
}
