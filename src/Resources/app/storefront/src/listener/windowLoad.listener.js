import WbmDataLayer from '../plugin/datalayer.plugin';

if (typeof onEventDataLayer !== 'undefined') {
    window.addEventListener('load', function () {
        WbmDataLayer.push(onEventDataLayer);
    });
}
