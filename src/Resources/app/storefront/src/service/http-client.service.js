import HttpClient from 'src/service/http-client.service';
import DomAccess from 'src/helper/dom-access.helper';
import WbmDataLayer from '../plugin/datalayer.plugin';

const __superFunc = HttpClient.prototype._registerOnLoaded;
HttpClient.prototype._registerOnLoaded = function (request, callback) {
    __superFunc.call(this, request, callback);
    request.addEventListener('loadend', () => {
        var response = request.responseText;
        var domParser = new DOMParser();
        var parsedResponse = domParser.parseFromString(response, 'text/html');
        var element = DomAccess.querySelector(parsedResponse, '#wbm-data-layer', false);

        if (element && window.dataLayer) {
            const dataLayers = JSON.parse(element.innerHTML);
            for (const key in dataLayers) {
                if (!dataLayers.hasOwnProperty(key)) {
                    continue;
                }

                var dataLayer = JSON.parse(dataLayers[key]);
                WbmDataLayer.push(dataLayer);
            }
        }
    });
};
