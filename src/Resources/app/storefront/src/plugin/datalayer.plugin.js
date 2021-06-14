import Plugin from 'src/plugin-system/plugin.class';

export default class WbmDataLayer extends Plugin {

    init() {
        // just because we need a init function
    }

    static push(dataLayer) {
        if (!dataLayer.hasOwnProperty('ecommerce') && !dataLayer.ecommerce.hasOwnProperty('impressions')) {
            window.dataLayer.push(dataLayer);
            return;
        }

        const size = (new TextEncoder().encode(JSON.stringify(dataLayer)).length) / 1024;

        if (Math.floor(size) < 5) {
            window.dataLayer.push(dataLayer);
            return;
        }

        console.log('have some impressions to split');

        var impressions = dataLayer.ecommerce.impressions;
        var ecommerce = dataLayer.ecommerce;
        var subset = 1;
        var newDataLayer = WbmDataLayer.createEmptyDataLayer(ecommerce, subset);

        var splittedImpressions = [];
        for (var i = 1; i < impressions.length; i++) {
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
        console.log(dataLayer, splittedImpressions);
        dataLayer.ecommerce.impressions = splittedImpressions;
        window.dataLayer.push(dataLayer);
    }

    static createEmptyDataLayer(ecommerce, subset) {
        var dataLayer = {};
        dataLayer.event = 'impressions';
        dataLayer.ecommerce = ecommerce;
        dataLayer.ecommerce.subset = subset;
        dataLayer.ecommerce.impressions = [];

        return dataLayer
    }
}
