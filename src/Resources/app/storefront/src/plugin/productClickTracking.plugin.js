import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class ProductClickTracking extends Plugin {

    init() {
        this.registerEvents();
    }

    registerEvents() {
        var self = this;
        console.log(this.el);
        this.el.addEventListener('click', function (event) {
            self.onProductClicked(event)
        });
    }

    setImpressions() {
        var self = this;

        var dataLayer = window.dataLayer;
        if (typeof onEventDataLayer !== 'undefined') {
            dataLayer = onEventDataLayer;
        }

        if (dataLayer) {
            for (let i = 0; i < window.dataLayer.length; i++) {
                var layer = window.dataLayer[i];

                if (layer.ecommerce && layer.ecommerce.impressions) {
                    self.impressions = layer.ecommerce.impressions;
                }
            }
        }
    }

    onProductClicked(event) {
        var self = this;
        self.setImpressions();

        var parent = self.el.closest('.product-box'),
            inputField = DomAccess.querySelector(parent, '[itemprop="mpn"]'),
            productNo = DomAccess.getAttribute(inputField, 'content'),
            product = self.impressions.find(function (value, index) {
                return value.id === productNo;
            });

        console.log(parent);
        console.log(product);
        if (product === undefined) {
            return;
        }

        console.log(event);
        console.log(event.target);
        event.preventDefault()

        if (event.target.nodeName === 'A' || event.target.nodeName === 'BUTTON') {
            window.dataLayer.push({
                'event': 'productClick',
                'ecommerce': {
                    'click': {
                        'actionField': {'list': product.list},
                        'products': [product]
                    }
                }
            });
            // if (DomAccess.hasAttribute(event.target, 'href')) {
            //     document.location = DomAccess.getAttribute(event.target, 'href');
            // }
        }
    }
}
