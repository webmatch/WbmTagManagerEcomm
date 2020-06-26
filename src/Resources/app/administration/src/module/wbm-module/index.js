import './page/wbm-module-list';
import './page/wbm-module-detail';
import './page/wbm-module-create';
import deDE from './snippet/de-DE.json';
import enGB from './snippet/en-GB.json';

const { Module } = Shopware;

Module.register('wbm-module', {
    color: '#ff3d58',
    icon: 'default-shopping-paper-bag-product',
    title: 'wbm-tagmanager.modules.title',
    description: '',

    snippets: {
        'de-DE': deDE,
        'en-GB': enGB
    },

    routes: {
        list: {
            component: 'wbm-module-list',
            path: 'list'
        },
        detail: {
            component: 'wbm-module-detail',
            path: 'detail/:id',
            meta: {
                parentPath: 'wbm.module.list'
            }
        },
        create: {
            component: 'wbm-module-create',
            path: 'create',
            meta: {
                parentPath: 'wbm.module.list'
            }
        }
    }
});
