import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class Promotions extends Plugin {

    init() {
        const allPromotionObjects = DomAccess.querySelectorAll(this.el, '[data-promotion]');
        let promotions = [];

        allPromotionObjects.forEach(function (value, index) {
            const dataSet = JSON.parse(JSON.stringify(value.dataset));

            if (typeof dataSet.promotionId === 'undefined' && dataSet.promotionName === 'undefinded') {
                return;
            }

            let promotion = {
                id: dataSet.promotionId || '',
                name: dataSet.promotionName || '',
                creative: dataSet.promotionCreative || '',
                position: dataSet.promotionPosition || ''
            }

            promotions.push(promotion);
        });

        window.dataLayer.push({
            'event': 'promotions',
            'ecommerce': {
                'promoView': {
                    'promotions': promotions
                }
            }
        });
    }


}
