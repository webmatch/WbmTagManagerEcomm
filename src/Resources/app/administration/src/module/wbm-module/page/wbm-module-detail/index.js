import template from './wbm-module-detail.html.twig';

const { Component, Mixin } = Shopware;

Component.register('wbm-module-detail', {
    template,

    inject: [
        'repositoryFactory',
        'context'
    ],


    mixins: [
        Mixin.getByName('notification')
    ],

    metaInfo() {
        return {
            title: this.$createTitle()
        };
    },

    data() {
        return {
            module: null,
            isLoading: false,
            processSuccess: false,
            repository: null
        };
    },

    created() {
        this.repository = this.repositoryFactory.create('wbm_data_layer_modules');
        this.propertyRepository = this.repositoryFactory.create('wbm_data_layer_properties');
        this.getModule();
    },

    methods: {
        getModule() {
            this.repository
                .get(this.$route.params.id, Shopware.Context.api)
                .then((entity) => {
                    this.module = entity;
                });
        },

        onClickSave() {
            this.isLoading = true;

            this.repository
                .save(this.module, Shopware.Context.api)
                .then(() => {
                    this.getModule();
                    this.isLoading = false;
                    this.processSuccess = true;
                }).catch((exception) => {
                    this.isLoading = false;
                    this.createNotificationError({
                        title: 'Error',
                        message: exception
                    });
                });
        },

        saveFinish() {
            this.processSuccess = false;
        }
    }
});
