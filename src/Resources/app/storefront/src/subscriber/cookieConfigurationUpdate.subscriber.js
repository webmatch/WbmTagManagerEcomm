console.log('cookieConfigurationUpdate.subscriber');

import { COOKIE_CONFIGURATION_UPDATE } from 'src/plugin/cookie/cookie-configuration.plugin';

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
