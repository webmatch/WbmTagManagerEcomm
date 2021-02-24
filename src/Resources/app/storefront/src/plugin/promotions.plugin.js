import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class Promotions extends Plugin {
    init() {
        const self = this;
        let promotionObjects = false;
        try {
            promotionObjects = DomAccess.querySelectorAll(this.el, '[data-promotion]');
        } catch (e) {
            // just no object found
        }

        if (!promotionObjects) {
            return;
        }

        this.promotions = [];

        promotionObjects.forEach((object) => {
            self.registerEvent(object);
        });

        this.pushPromoView();
    }

    registerEvent(object) {
        const self = this;
        try {
            const promotionLinks = DomAccess.querySelectorAll(object, 'a, area');

            promotionLinks.forEach((link) => {
                const dataSet = JSON.parse(JSON.stringify(link.dataset));
                if (typeof dataSet.promotionId === 'undefined' && dataSet.promotionName === 'undefinded') {
                    return;
                }
                self.addPromotion(dataSet);

                link.addEventListener('click', (event) => {
                    self.onPromotionClicked(event, link, dataSet);
                });
            });
        } catch (e) {
            // just no object found
        }
    }

    onPromotionClicked(event, link, dataSet) {
        event.preventDefault();

        dataLayer.push({
            event: 'promotionClick',
            ecommerce: {
                promoClick: {
                    promotions: [
                        {
                            id: dataSet.promotionId || '',
                            name: dataSet.promotionName || '',
                            creative: dataSet.promotionCreative || '',
                            position: dataSet.promotionPosition || ''
                        }]
                }
            },
            eventCallback: function () {
                document.location = DomAccess.getAttribute(link, 'href');
            }
        });
    }

    addPromotion(dataSet) {
        const promotion = {
            id: dataSet.promotionId || '',
            name: dataSet.promotionName || '',
            creative: dataSet.promotionCreative || '',
            position: dataSet.promotionPosition || ''
        };

        this.promotions.push(promotion);
    }

    pushPromoView() {
        if (this.promotions.length > 0) {
            window.dataLayer.push({
                event: 'promotions',
                ecommerce: {
                    promoView: {
                        promotions: this.promotions
                    }
                }
            });
        }
    }
}
