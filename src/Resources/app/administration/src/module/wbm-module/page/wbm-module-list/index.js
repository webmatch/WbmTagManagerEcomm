import template from './wbm-module-list.html.twig';

const { Component } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('wbm-module-list', {
    template,

    inject: [
        'repositoryFactory',
        'context'
    ],

    data() {
        return {
            repository: null,
            modules: null
        };
    },

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },


    computed: {
        columns() {
            return [{
                property: 'name',
                dataIndex: 'name',
                label: this.$t('wbm-tagmanager.modules.nameLabel'),
                routerLink: 'wbm.module.detail',
                inlineEdit: 'string',
                allowResize: true,
                primary: true
            }];
        }
    },

    created() {
        this.repository = this.repositoryFactory.create('wbm_data_layer_modules');

        this.repository
            .search(new Criteria(), Shopware.Context.api)
            .then((result) => {
                this.modules = result;
            });
    }
});
