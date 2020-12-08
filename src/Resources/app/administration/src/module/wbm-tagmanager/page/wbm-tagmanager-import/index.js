import template from './wbm-tagmanager-import.html.twig';

const { Component, Mixin } = Shopware;

Component.register('wbm-tagmanager-import', {
    template,

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
            isLoading: false,
            file: null,
            truncate: true
        };
    },

    methods: {
        truncateChange(state) {
            this.truncate = state;
        },
        handleFileUpload() {
            this.file = this.$refs.file.selectedFile;
        },
        onClickImport(e) {
            e.preventDefault();

            const basicHeaders = {
                Authorization: `Bearer ${Shopware.Context.api.authToken.access}`,
                'Content-Type': 'multipart/form-data'
            };
            const formData = new FormData();
            formData.append('file', this.file);
            formData.append('truncate', this.truncate);

            Shopware.Application.getContainer('init').httpClient
                .post('_action/wbm-tagmanager/import', formData, { headers: basicHeaders })
                .then(() => {
                    this.$router.push({ name: 'wbm.tagmanager.tabs' });
                });
        }
    }
});
