import template from './wbm-property-tree.html.twig';

const { Component } = Shopware;
const { Criteria } = Shopware.Data;

Component.register('wbm-property-tree', {
    template,

    inject: ['repositoryFactory', 'context'],

    props: {
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

    data() {
        return {
            properties: {},
            loadedParentIds: [],
            linkContext: 'wbm.property.detail',
            isLoadingInitialData: true,
            noSyncMode: false
        };
    },

    created() {
        this.createdComponent();
    },

    computed: {
        propertyRepository() {
            return this.repositoryFactory.create('wbm_data_layer_properties');
        },

        getProperties() {
            return Object.values(this.properties);
        }
    },

    methods: {
        createdComponent() {
            this.onModuleChange();
        },

        onModuleChange() {
            this.isLoadingInitialData = true;

            this.repository = this.repositoryFactory.create('wbm_data_layer_properties');

            const criteria = new Criteria();
            criteria.limit = 500;
            criteria.addFilter(Criteria.equals('parentId', null));
            criteria.addFilter(Criteria.equals('module', this.module));

            const properties = {};
            const loadedParentIds = [];

            this.repository
                .search(criteria, Shopware.Context.api)
                .then((result) => {
                    result.forEach((row) => {
                        properties[row.id] = row;
                        loadedParentIds.push(row.parentId);
                    });
                    this.properties = { ...properties };
                    this.loadedParentIds = loadedParentIds;
                    this.isLoadingInitialData = false;

                    this.getProperties.forEach((parent) => {
                        this.onGetTreeItems(parent.id).then(() => {
                            if (this.$refs.swTree && parent) {
                                this.$refs.swTree.openTreeById(parent.id);
                            }
                        });
                    });
                });
        },

        getChildrenFromParent(parentId) {
            return this.onGetTreeItems(parentId);
        },

        onGetTreeItems(parentId) {
            if (this.loadedParentIds.includes(parentId)) {
                return Promise.resolve();
            }

            this.loadedParentIds.push(parentId);
            const propertyCriteria = new Criteria(1, 500);
            propertyCriteria.addFilter(Criteria.equals('parentId', parentId));
            propertyCriteria.addFilter(Criteria.equals('module', this.module));

            return this.propertyRepository.search(propertyCriteria, Shopware.Context.api).then((children) => {
                this.addProperties(children);

                children.forEach((parent) => {
                    this.onGetTreeItems(parent.id).then(() => {
                        if (this.$refs.swTree && parent) {
                            try {
                                this.$refs.swTree.openTreeById(parent.id);
                            } catch (error) {
                                // Uncaught (in promise) TypeError: Cannot read property 'id' of null ¯\_( ツ )_/¯
                            }
                        }
                    });
                });
            }).catch(() => {
                this.loadedParentIds = this.loadedParentIds.filter((id) => {
                    return id !== parentId;
                });
            });
        },

        onUpdatePositions({ draggedItem, oldParentId, newParentId }) {
            if (draggedItem.children.length > 0) {
                draggedItem.children.forEach((child) => {
                    this.removeFromStore(child.id);
                });
                this.loadedParentIds = this.loadedParentIds.filter((id) => id !== draggedItem.id);
            }

            this.syncSiblings({ parentId: newParentId }).then(() => {
                if (oldParentId !== newParentId) {
                    this.syncSiblings({ parentId: oldParentId });
                }
            });
        },

        changeProperty(property) {
            this.$parent.$emit('wbm-property-id-change', property.id);
        },

        createNewElement(contextItem, parentId, name = '') {
            if (!parentId && contextItem) {
                parentId = contextItem.parentId;
            }
            const newProperty = this.createNewProperty(name, parentId);
            this.addProperty(newProperty);

            return newProperty;
        },

        createNewProperty(name, parentId) {
            const newProperty = this.propertyRepository.create(Shopware.Context.api);

            newProperty.name = name;
            newProperty.parentId = parentId;
            newProperty.module = this.$route.params.module;
            newProperty.childCount = 0;
            newProperty.value = '';

            newProperty.save = () => {
                return this.propertyRepository.save(newProperty, Shopware.Context.api).then(() => {
                    const criteria = new Criteria();
                    criteria.setIds([newProperty.id, parentId].filter((id) => id !== null));
                    this.propertyRepository.search(criteria, Shopware.Context.api).then((properties) => {
                        this.addProperties(properties);
                    });
                });
            };

            return newProperty;
        },

        addProperty(property) {
            this.properties[property.id] = property;

            this.properties = { ...this.properties };
        },

        addProperties(properties) {
            properties.forEach((property) => {
                this.properties[property.id] = property;
            });

            this.properties = { ...this.properties };
        },

        onDeleteProperty({ data: property }) {
            if (property.isNew()) {
                delete this.properties[property.id];
                this.properties = { ...this.properties };

                return Promise.resolve();
            }

            this.$parent.$emit('wbm-property-id-change', null);

            return this.propertyRepository.delete(property.id, Shopware.Context.api).then(() => {
                this.removeFromStore(property.id);

                if (property.parentId !== null) {
                    this.propertyRepository.get(property.parentId, Shopware.Context.api).then((updatedParent) => {
                        const children = this.getProperties.filter((child) => {
                            return child.parentId === updatedParent.id;
                        });
                        updatedParent.childCount = children.length;

                        this.propertyRepository.save(updatedParent, Shopware.Context.api).then(() => {
                            this.addProperty(updatedParent);
                        });
                    });
                }
            });
        },

        onEditEnd({ parentId }) {
            if (this.noSyncMode === true) {
                return Promise.resolve();
            }

            return this.syncSiblings({ parentId: parentId });
        },

        syncSiblings({ parentId }) {
            const siblings = this.getProperties.filter((property) => {
                return property.parentId === parentId;
            });

            return this.propertyRepository.sync(siblings, Shopware.Context.api).then(() => {
                this.loadedParentIds = this.loadedParentIds.filter(id => id !== parentId);

                return this.getChildrenFromParent(parentId);
            }).then(() => {
                const parent = this.getProperties.filter((property) => {
                    return property.id === parentId;
                });

                if (parent.length) {
                    parent[0].childCount = siblings.length;

                    this.propertyRepository.sync(parent, Shopware.Context.api).then((updatedParent) => {
                        this.addProperty(updatedParent);
                    });
                }
            });
        },

        removeFromStore(id) {
            const deletedIds = this.getDeletedIds(id);
            this.loadedParentIds = this.loadedParentIds.filter((loadedId) => {
                return !deletedIds.includes(loadedId);
            });

            deletedIds.forEach((deleted) => {
                delete this.properties[deleted];
            });
            this.properties = { ...this.properties };
        },

        getDeletedIds(idToDelete) {
            const idsToDelete = [idToDelete];
            Object.keys(this.properties).forEach((id) => {
                const currentProperty = this.properties[id];
                if (currentProperty.parentId === idToDelete) {
                    idsToDelete.push(...this.getDeletedIds(id));
                }
            });

            return idsToDelete;
        }
    }
});
