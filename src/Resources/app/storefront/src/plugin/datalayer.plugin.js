import Plugin from 'src/plugin-system/plugin.class';

export default class WbmDataLayer extends Plugin {
    static event = '';

    init() {
        // just because we need an init function
    }

    static push(dataLayer) {
        if (
            !dataLayer.hasOwnProperty('ecommerce') ||
            !dataLayer.ecommerce.hasOwnProperty('impressions') ||
            !dataLayer.hasOwnProperty('event')
        ) {
            window.dataLayer.push(dataLayer);
            return;
        }

        WbmDataLayer.event = dataLayer.event;
        const size = (new TextEncoder().encode(JSON.stringify(dataLayer)).length) / 1024;

        if (Math.ceil(size) < 6) {
            window.dataLayer.push(dataLayer);
            return;
        }

        const impressions = dataLayer.ecommerce.impressions;
        const ecommerce = dataLayer.ecommerce;
        let subset = 1;
        let newDataLayer = WbmDataLayer.createEmptyDataLayer(ecommerce, subset);
        let splittedImpressions = [];

        for (let i = 1; i < impressions.length; i++) {
            splittedImpressions.push(impressions[i-1]);

            if (i % 8 === 0) {
                WbmDataLayer.pushSubset(newDataLayer, splittedImpressions);
                subset++;
                newDataLayer = WbmDataLayer.createEmptyDataLayer(ecommerce, subset);
                splittedImpressions = [];
            }
        }
        // push leftovers
        WbmDataLayer.pushSubset(newDataLayer, splittedImpressions);
    }

    static pushSubset(dataLayer, splittedImpressions) {
        dataLayer.ecommerce.impressions = splittedImpressions;
        window.dataLayer.push(dataLayer);
    }

    static createEmptyDataLayer(ecommerce, subset) {
        const dataLayer = {};
        dataLayer.event = WbmDataLayer.event;
        dataLayer.ecommerce = ecommerce;
        dataLayer.ecommerce.subset = subset;
        dataLayer.ecommerce.impressions = [];

        return dataLayer
    }
}
