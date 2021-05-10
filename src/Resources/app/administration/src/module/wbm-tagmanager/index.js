import './page/wbm-tagmanager-tabs';
import './page/wbm-tagmanager-import';
import deDE from './snippet/de-DE.json';
import enGB from './snippet/en-GB.json';

const { Module } = Shopware;

Module.register('wbm-tagmanager', {
    color: '#ff3d58',
    icon: 'default-shopping-paper-bag-product',
    title: 'wbm-tagmanager.tabs.title',
    description: '',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        tabs: {
            component: 'wbm-tagmanager-tabs',
            path: 'tabs'
        },
        import: {
            component: 'wbm-tagmanager-import',
            path: 'import'
        }
    },

    navigation: [{
        label: 'wbm-tagmanager.tabs.menuEntry',
        color: '#00acd2',
        path: 'wbm.tagmanager.tabs',
        icon: 'default-text-code',
        parent: 'sw-marketing',
        position: 1000
    }]
});
