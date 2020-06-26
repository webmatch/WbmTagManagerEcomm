const { Component } = Shopware;

Component.extend('wbm-tree-item', 'sw-tree-item', {
    methods: {
        abortCreateElement(item) {
            if (this.parentScope.currentEditMode === null && item.parentId === null) {
                this.parentScope.$parent.noSyncMode = true;
            }

            this.parentScope.abortCreateElement(item);
            this.parentScope.$parent.noSyncMode = false;
        }
    }
});
