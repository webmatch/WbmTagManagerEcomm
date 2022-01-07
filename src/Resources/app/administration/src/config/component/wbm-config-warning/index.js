import template from './wbm-config-warning.html.twig';
import deDE from './snippet/de-DE.json';
import enGB from './snippet/en-GB.json';

console.log('wbm-config-warning');

const { Component, Utils } = Shopware;

Component.register('wbm-config-warning', {
    template,

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },
    created() {
        console.log(Utils.get('WbmTagManagerEcomm.config.isRiskAccepted'));
        console.log(Utils.object.get('WbmTagManagerEcomm.config.isRiskAccepted'));
        console.log(document.getElementById('WbmTagManagerEcomm.config.scriptTagAttributes'));
    },
    mounted() {
        console.log(Utils.get('WbmTagManagerEcomm.config.isRiskAccepted'));
        console.log(Utils.object.get('WbmTagManagerEcomm.config.isRiskAccepted'));
        console.log(document.getElementById('WbmTagManagerEcomm.config.scriptTagAttributes'));
    }
});
