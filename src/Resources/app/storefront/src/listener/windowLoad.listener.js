console.log('windowLoad.listener');

if (typeof onEventDataLayer !== 'undefined') {
    window.addEventListener('load', function () {
        console.log('send from listener file');
        // window.dataLayer.push(onEventDataLayer);
        //@TODO: test this:
        WbmDataLayer.push(onEventDataLayer);
    });
}
