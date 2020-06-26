import template from './wbm-property-list.html.twig';
import './wbm-property-list.scss';

const { Component } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('wbm-property-list', {
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
                label: this.$t('wbm-tagmanager.properties.nameLabel'),
                routerLink: 'wbm.property.detail',
                inlineEdit: 'string',
                allowResize: true,
                primary: true
            },
            {
                property: 'value',
                dataIndex: 'value',
                label: this.$t('wbm-tagmanager.properties.valueLabel'),
                routerLink: 'wbm.property.detail',
                inlineEdit: 'string',
                allowResize: true
            }];
        }
    },

    created() {
        this.repositoryFactory.create('wbm_data_layer_modules')
            .search(new Criteria(), Shopware.Context.api)
            .then((result) => {
                this.modules = result;
            });
    }
});
