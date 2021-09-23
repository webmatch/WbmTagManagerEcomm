import Plugin from 'src/plugin-system/plugin.class';
import DomAccess from 'src/helper/dom-access.helper';

export default class ProductClickTracking extends Plugin {
    impressions = null;

    init() {
        if (gtmIsTrackingProductClicks !== true) {
            return;
        }
        this._registerEvents();
    }

    _registerEvents() {
        const self = this;
        this.el.addEventListener('click', (event) => {
            self.onProductClicked(event);
        });
    }

    _setImpressions() {
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

        try {
            this._setImpressions();
            const product = this._getProduct();

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

        if (this._shouldRedirect(event)) {
            document.location = DomAccess.getAttribute(this.el, 'href');
        }
    }

    _getProduct() {
        const parent = this.el.closest(this.options.parent);
        const inputField = DomAccess.querySelector(parent, '[itemprop="sku"]');
        const productNo = DomAccess.getAttribute(inputField, 'content');
        const product = this.impressions.find((value, index) => {
            return value.id === productNo;
        });

        if (product === undefined) {
            throw new InvalidImpressionsError('product not found in impressions');
        }

        return product
    }

    _shouldRedirect(event) {
        let redirect = false;

        // is there even a link?
        if (DomAccess.hasAttribute(this.el, 'href')) {
            redirect = true;
        }
        // is add to cart button
        if (event.target.classList.contains('btn-buy')) {
            redirect = false;
        }
        // enabled quickview feature of SwagCmsExtension?
        const quickviewSelector = '[data-swag-cms-extensions-quickview="true"]';
        if (this.el.closest('.cms-section').querySelector(quickviewSelector) !== null
            || (document.body.classList.contains('is-ctl-search')
                && this.el.closest('.container-main').querySelector(quickviewSelector) !== null)
        ) {
            redirect = false;
        }

        return redirect;
    }
}

class InvalidImpressionsError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidImpressionsError';
    }
}
