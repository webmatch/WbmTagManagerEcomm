import template from './wbm-config-warning.html.twig';
import deDE from './snippet/de-DE.json';
import enGB from './snippet/en-GB.json';

console.log('wbm-config-warning');

const { Component } = Shopware;

Component.register('wbm-config-warning', {
    template,

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    }
});
