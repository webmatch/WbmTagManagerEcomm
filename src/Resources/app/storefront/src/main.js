/* eslint-disable import/no-unresolved */

import HttpClient from 'src/service/http-client.service';
import { COOKIE_CONFIGURATION_UPDATE } from 'src/plugin/cookie/cookie-configuration.plugin';

const __superFunc = HttpClient.prototype._registerOnLoaded;
HttpClient.prototype._registerOnLoaded = function (request, callback) {
    __superFunc.call(this, request, callback);
    request.addEventListener('loadend', () => {
        let gtmPush = request.getResponseHeader('gtm-push');
        if (gtmPush === 'null'){
            gtmPush = null;
        }

        if (gtmPush && window.dataLayer) {
            const pushes = JSON.parse(gtmPush);
            for (const key in pushes) {
                window.dataLayer.push(JSON.parse(pushes[key]));
            }

            if (window.gaRegisterClickTracking) {
                window.gaRegisterClickTracking();
            }
        }
    });
};

function eventCallback(updatedCookies) {
    if (typeof updatedCookies.detail['wbm-tagmanager-enabled'] !== 'undefined'
        && updatedCookies.detail['wbm-tagmanager-enabled']
        && !window.wbmScriptIsSet
    ) {
        const newScript = document.createElement('script');
        const inlineScript = document.createTextNode(
            `(${window.googleTag})(window,document,'script','dataLayer', '${window.wbmGoogleTagmanagerId}');`
        );
        newScript.appendChild(inlineScript);

        const script = document.getElementById('wbmTagManger');
        script.parentNode.insertBefore(newScript, script.nextSibling);

        window.wbmScriptIsSet = true;
        window.googleTag = null;
    }
}

document.$emitter.subscribe(COOKIE_CONFIGURATION_UPDATE, eventCallback);
