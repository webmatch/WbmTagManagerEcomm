import './component/wbm-property-tree';
import './component/wbm-tree-item';
import './page/wbm-property-list';
import './page/wbm-property-detail';
import deDE from './snippet/de-DE.json';
import enGB from './snippet/en-GB.json';

const { Module } = Shopware;

Module.register('wbm-property', {
    color: '#ff3d58',
    icon: 'default-shopping-paper-bag-product',
    title: 'wbm-tagmanager.properties.title',
    description: '',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        list: {
            component: 'wbm-property-list',
            path: 'list/:module'
        }
    }
});
