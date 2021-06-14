/* eslint-disable import/no-unresolved */
import PluginManager from 'src/plugin-system/plugin.manager';
import WbmDataLayer from "./plugin/datalayer.plugin";
import ProductClickTracking from './plugin/productClickTracking.plugin';
import Promotions from './plugin/promotions.plugin';

import './listener/windowLoad.listener';
import './service/http-client.service';
import './subscriber/cookieConfigurationUpdate.subscriber';

PluginManager.register('WbmDataLayer', WbmDataLayer);
PluginManager.register('ProductClickTracking', ProductClickTracking, '.product-box a', { parent: '.product-box' });
PluginManager.register('ProductClickTracking', ProductClickTracking, '.product-box button', { parent: '.product-box' });
PluginManager.register('Promotions', Promotions);

// Necessary for the webpack hot module reloading server
if (module.hot) {
    module.hot.accept();
}
