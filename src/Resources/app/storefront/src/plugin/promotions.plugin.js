import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class Promotions extends Plugin {

    init() {
        let self = this;
        let promotionObjects = DomAccess.querySelectorAll(this.el, '[data-promotion]');
        console.log(promotionObjects);

        if (!promotionObjects) {
            return;
        }

        this.promotions = [];

        promotionObjects.forEach(function (object) {
            const dataSet = JSON.parse(JSON.stringify(object.dataset));

            if (typeof dataSet.promotionId === 'undefined' && dataSet.promotionName === 'undefinded') {
                return;
            }

            self.addPromotion(dataSet);
            self.registerEvent(object, dataSet);

        });

        this.pushPromoView();
    }

    registerEvent(object, dataSet) {
        const self = this;
        try {
            const promotionLinks = DomAccess.querySelectorAll(object, 'a');

            promotionLinks.forEach(function (link) {
                link.addEventListener('click', function (event) {
                    self.onPromotionClicked(event, link, dataSet)
                })
            })
        } catch (e) {
            // do nothing
        }
    }

    onPromotionClicked(event, link, dataSet) {
        event.preventDefault();

        dataLayer.push({
            'event': 'promotionClick',
            'ecommerce': {
                'promoClick': {
                    'promotions': [
                        {
                            'id': dataSet.promotionId || '',
                            'name': dataSet.promotionName || '',
                            'creative': dataSet.promotionCreative || '',
                            'position': dataSet.promotionPosition || ''
                        }]
                }
            },
            'eventCallback': function () {
                document.location = DomAccess.getAttribute(link, 'href');
            }
        });

    }

    addPromotion(dataSet) {
        let promotion = {
            id: dataSet.promotionId || '',
            name: dataSet.promotionName || '',
            creative: dataSet.promotionCreative || '',
            position: dataSet.promotionPosition || ''
        }

        this.promotions.push(promotion);
    }

    pushPromoView() {
        console.log(this.promotions);
        if (this.promotions.length > 0) {
            window.dataLayer.push({
                'event': 'promotions',
                'ecommerce': {
                    'promoView': {
                        'promotions': this.promotions
                    }
                }
            });
        }
    }
}
