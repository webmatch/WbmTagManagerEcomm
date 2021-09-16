import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class ProductClickTracking extends Plugin {
    impressions = null;

    init() {
        if (gtmIsTrackingProductClicks !== true) {
            return;
        }
        this.registerEvents();
    }

    registerEvents() {
        const self = this;
        this.el.addEventListener('click', (event) => {
            self.onProductClicked(event);
        });
    }

    setImpressions() {
        const dataLayer = [
            window.dataLayer
        ];
        if (typeof onEventDataLayer !== 'undefined') {
            dataLayer.push(onEventDataLayer);
        }

        if (dataLayer) {
            for (let i = 0; i < dataLayer.length; i++) {
                for (let j = 0; j < dataLayer[i].length; j++) {
                    const layer = dataLayer[i][j];

                    if (layer.ecommerce && layer.ecommerce.impressions) {
                        this.impressions = layer.ecommerce.impressions;
                    }
                }
            }
        }

        if (this.impressions === null || this.impressions.length === 0) {
            throw new InvalidImpressionsError('no impressions found');
        }
    }

    onProductClicked(event) {
        if (DomAccess.hasAttribute(this.el, 'href')) {
            event.preventDefault();
        }
        let redirect = true;

        try {
            this.setImpressions();

            const parent = this.el.closest(this.options.parent);
            console.log(parent.parentElement);
            // enable quickview feature of SwagCmsExtension
            if (parent.parentElement.dataset.swagCmsExtensionsQuickviewBox) {
                redirect = false;
            }
            const inputField = DomAccess.querySelector(parent, '[itemprop="sku"]');
            const productNo = DomAccess.getAttribute(inputField, 'content');
            const product = this.impressions.find((value, index) => {
                return value.id === productNo;
            });

            if (product === undefined) {
                throw new InvalidImpressionsError('product not found in impressions');
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
        } catch (e) {
            // if something went wrong, just go on ...
        }

        if (DomAccess.hasAttribute(this.el, 'href')) {
            console.log(this.el);
            console.log('wbm redirect');
            if (redirect) {
                document.location = DomAccess.getAttribute(this.el, 'href');
            }
        }
    }
}

class InvalidImpressionsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidImpressionsError';
    }
}
