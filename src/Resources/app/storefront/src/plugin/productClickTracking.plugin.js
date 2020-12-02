import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class ProductClickTracking extends Plugin {

    init() {
        this.registerEvents();
    }

    registerEvents() {
        var self = this;
        this.el.addEventListener('click', function (event) {
            self.onProductClicked(event);
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
        if (DomAccess.hasAttribute(self.el, 'href')) {
            event.preventDefault();
        }
        self.setImpressions();

        var parent = self.el.closest('.product-box'),
            inputField = DomAccess.querySelector(parent, '[itemprop="mpn"]'),
            productNo = DomAccess.getAttribute(inputField, 'content'),
            product = self.impressions.find(function (value, index) {
                return value.id === productNo;
            });

        if (product === undefined) {
            return;
        }

        window.dataLayer.push({
            'event': 'productClick',
            'ecommerce': {
                'click': {
                    'actionField': {'list': product.list},
                    'products': [product]
                }
            }
        });


        if (DomAccess.hasAttribute(self.el, 'href')) {
            document.location = DomAccess.getAttribute(self.el, 'href');
        }
    }
}
