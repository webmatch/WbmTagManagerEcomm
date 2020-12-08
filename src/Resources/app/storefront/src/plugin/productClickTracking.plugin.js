import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class ProductClickTracking extends Plugin {
    init() {
        this.registerEvents();
    }

    registerEvents() {
        const self = this;
        this.el.addEventListener('click', (event) => {
            self.onProductClicked(event);
        });
    }

    setImpressions() {
        const self = this;

        let dataLayer = window.dataLayer;
        if (typeof onEventDataLayer !== 'undefined') {
            dataLayer = onEventDataLayer;
        }

        if (dataLayer) {
            for (let i = 0; i < window.dataLayer.length; i++) {
                const layer = window.dataLayer[i];

                if (layer.ecommerce && layer.ecommerce.impressions) {
                    self.impressions = layer.ecommerce.impressions;
                }
            }
        }
    }

    onProductClicked(event) {
        const self = this;
        if (DomAccess.hasAttribute(self.el, 'href')) {
            event.preventDefault();
        }
        self.setImpressions();

        const parent = self.el.closest('.product-box');
        const inputField = DomAccess.querySelector(parent, '[itemprop="mpn"]');
        const productNo = DomAccess.getAttribute(inputField, 'content');
        const product = self.impressions.find((value, index) => {
            return value.id === productNo;
        });

        if (product === undefined) {
            return;
        }

        window.dataLayer.push({
            event: 'productClick',
            ecommerce: {
                click: {
                    actionField: { list: product.list },
                    products: [product]
                }
            }
        });

        if (DomAccess.hasAttribute(self.el, 'href')) {
            document.location = DomAccess.getAttribute(self.el, 'href');
        }
    }
}
