import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class ProductClickTracking extends Plugin {

    init() {
        this._registerEvents();
    }

    _registerEvents() {
        var self = this;
        this.el.addEventListener('click', function() { self._onProductClicked() });
    }

    _setImpressions() {
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

    _onProductClicked() {
        var self = this;
        self._setImpressions();

        var inputField = DomAccess.querySelector(self.el, '[itemprop="mpn"]'),
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
    }
}
