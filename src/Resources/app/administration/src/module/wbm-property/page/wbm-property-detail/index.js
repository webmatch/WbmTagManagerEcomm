import template from './wbm-property-detail.html.twig';

const { Component, Mixin } = Shopware;

Component.register('wbm-property-detail', {
    template,

    inject: [
        'repositoryFactory',
        'context'
    ],

    props: {
        propertyId: {
            type: Number,
            required: false
        },
        module: {
            type: String,
            required: false
        }
    },

    watch: {
        module() {
            this.onModuleChange();
        }
    },

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
            propertyId: null,
            module: null,
            property: null,
            isLoading: false,
            processSuccess: false,
            repository: null
        };
    },

    created() {
        this.$parent.$on('wbm-property-id-change', this.setProperty);
    },

    methods: {
        onModuleChange() {
            this.propertyId = null;
            this.property = null;
        },

        setProperty(propertyId) {
            if (!propertyId) {
                this.property = null;

                return;
            }

            this.repository = this.repositoryFactory.create('wbm_data_layer_properties');
            this.propertyId = propertyId;
            this.getProperty();
        },

        getProperty() {
            this.repository
                .get(this.propertyId, Shopware.Context.api)
                .then((entity) => {
                    if (entity.value === null) {
                        entity.value = '';
                    }

                    this.property = entity;
                });
        },

        onClickSave() {
            this.isLoading = true;

            console.log(this.property);
            this.property.value = this.property.value.replace(/(\r\n|\n|\r)/gm, '');

            this.repository
                .save(this.property, Shopware.Context.api)
                .then(() => {
                    this.getProperty();
                    this.isLoading = false;
                    this.processSuccess = true;

                    this.$parent.$parent.$refs.wbmPropertyTree.onModuleChange();
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
