import template from './wbm-tagmanager-tabs.html.twig';
import './wbm-tagmanager-tabs.scss';

const { Component } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('wbm-tagmanager-tabs', {
    template,

    inject: [
        'repositoryFactory',
        'context',
        'systemConfigApiService'
    ],

    data() {
        return {
            repository: null,
            modules: null,
            loadedConfig: false,
            config: null,
            routerPath: null
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    created() {
        this.repository = this.repositoryFactory.create('wbm_data_layer_modules');

        this.repository
            .search(new Criteria(), Shopware.Context.api)
            .then((result) => {
                this.modules = result;
            });

        this.salesChannelRepository = this.repositoryFactory.create('sales_channel');

        const config = [];

        this.systemConfigApiService
            .getValues('WbmTagManagerEcomm.config')
            .then(data => {
                const defaultContainerId = data['WbmTagManagerEcomm.config.containerId'];
                const defaultIsInactive = data['WbmTagManagerEcomm.config.isInactive'] === undefined ?
                    false :
                    data['WbmTagManagerEcomm.config.isInactive'];

                config.push({
                    salesChannel: this.$t('wbm-tagmanager.tabs.allStorefronts'),
                    containerId: defaultContainerId,
                    isInactive: defaultIsInactive
                });

                this.salesChannelRepository.search(new Criteria(), Shopware.Context.api).then((searchresult) => {
                    searchresult.forEach((salesChannel, idx, array) => {
                        this.systemConfigApiService
                            .getValues('WbmTagManagerEcomm.config', salesChannel.id)
                            .then(response => {
                                const containerId = response['WbmTagManagerEcomm.config.containerId'] === undefined ?
                                    defaultContainerId :
                                    response['WbmTagManagerEcomm.config.containerId'];
                                const isInactive = response['WbmTagManagerEcomm.config.isInactive'] === undefined ?
                                    defaultIsInactive :
                                    response['WbmTagManagerEcomm.config.isInactive'];

                                config.push({
                                    salesChannel: salesChannel.name,
                                    containerId: containerId,
                                    isInactive: isInactive
                                });

                                if (idx === array.length - 1) {
                                    this.config = config;
                                    this.loadedConfig = true;
                                }
                            });
                    });
                });
            });
    },

    computed: {
        getRouterPath() {
            const version = Shopware.Context.app.config.version.replace(/\./g, '');
            console.log(version);
            return (version < 6440 ? 'sw.plugin.settings' : 'sw.extension.config')
        }
    },

    methods: {
        onClickExport() {
            const basicHeaders = {
                Authorization: `Bearer ${Shopware.Context.api.authToken.access}`,
                'Content-Type': 'application/json'
            };

            Shopware.Application.getContainer('init').httpClient
                .get('_action/wbm-tagmanager/export', { headers: basicHeaders })
                .then((response) => {
                    const url = window.URL.createObjectURL(new Blob([response.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', 'dataLayer.json');
                    document.body.appendChild(link);
                    link.click();
                });
        }
    }
});
