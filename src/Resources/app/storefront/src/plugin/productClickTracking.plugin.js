import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class ProductClickTracking extends Plugin {
    impressions = null;

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
        let dataLayer = [
            window.dataLayer
        ];
        if (typeof onEventDataLayer !== 'undefined') {
            dataLayer.push(onEventDataLayer);
        }

        if (dataLayer) {
            for (let i = 0; i < dataLayer.length; i++) {
                const layer = dataLayer[i];

                if (layer.ecommerce && layer.ecommerce.impressions) {
                    this.impressions = layer.ecommerce.impressions;
                }
            }
        }

        if (this.impressions === null) {
            throw new InvalidImpressionsError('no impressions found');
        }
    }

    onProductClicked(event) {
        if (DomAccess.hasAttribute(this.el, 'href')) {
            event.preventDefault();
        }
        try {
            this.setImpressions();

            const parent = this.el.closest('.product-box');
            const inputField = DomAccess.querySelector(parent, '[itemprop="mpn"]');
            const productNo = DomAccess.getAttribute(inputField, 'content');
            const product = this.impressions.find((value, index) => {
                return value.id === productNo;
            });

            if (product === undefined) {
                return;
            }

            window.dataLayer.push({
                event: 'productClick',
                ecommerce: {
                    click: {
                        actionField: {list: product.list},
                        products: [product]
                    }
                }
            });
        } catch (e) {
            // if something went wrong, just go on ...
        }

        if (DomAccess.hasAttribute(this.el, 'href')) {
            document.location = DomAccess.getAttribute(this.el, 'href');
        }
    }
}

class InvalidImpressionsError extends Error {
    constructor(message) {
        super(message);
        this.name = "InvalidImpressionsError";
    }
}
