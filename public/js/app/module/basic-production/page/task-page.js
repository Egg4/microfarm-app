'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/model-view-page',
    'lib/widget/layout/stack-layout',
    'lib/widget/navigation/navigation',
    'lib/widget/layout/grid-layout',
    'lib/widget/html/html',
    'app/widget/table/model-table',
    'app/widget/popup/menu-popup',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, StackLayout, Navigation, GridLayout, Html, Table, MenuPopup, Button, Label, Icon) {

    return Page.extend({
        template: {
            working: _.template($('#task-page-working-table-row-template').html()),
            photo: _.template($('#task-page-photo-table-row-template').html()),
            tooling: _.template($('#task-page-tooling-table-row-template').html()),
            seedling: _.template($('#task-page-seedling-table-row-template').html()),
            transplanting: _.template($('#task-page-transplanting-table-row-template').html()),
            planting: _.template($('#task-page-planting-table-row-template').html()),
            output: _.template($('#task-page-output-table-row-template').html()),
            stage: _.template($('#task-page-stage-table-row-template').html()),
        },

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'task-page',
                title: this.buildTitle.bind(this),
                icon: new Icon({name: 'tasks'}),
                collection: app.collections.get('task'),
                body: this.buildBody.bind(this),
            });

            this.creationMenuPopup = this.buildCreationMenuPopup();
            this.listenTo(app.collections.get('working'), 'update', this.render);
            if (app.modules.has('extra-production')) {
                this.listenTo(app.collections.get('stage'), 'update', this.render);
                this.listenTo(app.collections.get('photo'), 'update', this.render);
            }
            if (app.modules.has('advanced-production')) {
                this.listenTo(app.collections.get('tooling'), 'update', this.render);
            }
            this.listenTo(app.collections.get('seedling'), 'update', this.render);
            this.listenTo(app.collections.get('transplanting'), 'update', this.render);
            this.listenTo(app.collections.get('planting'), 'update', this.render);
            this.listenTo(app.collections.get('output'), 'update', this.render);
        },

        buildTitle: function () {
            return this.model.getDisplayName();
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildNavigation(),
                    this.buildTaskHtml(),
                    this.buildFeaturesTable(),
                ],
            });
        },

        /*---------------------------------------- Navigation ------------------------------------------*/
        buildNavigation: function () {
            var items = this.buildNavigationButtons();
            return new Navigation({
                layout: new GridLayout({
                    column: items.length,
                    items: items,
                }),
            });
        },

        buildNavigationButtons: function () {
            var buttons = [];
            if (!_.isNull(this.model.get('crop_id')) && app.authentication.can('read', 'crop')) {
                buttons.push(this.buildCropButton());
            }
            if (!_.isNull(this.model.get('output_id')) && app.authentication.can('read', 'output')) {
                buttons.push(this.buildOutputButton());
            }
            if (app.authentication.can('update', 'task')) {
                buttons.push(this.buildEditButton());
            }
            return buttons;
        },

        buildCropButton: function () {
            var crop = this.model.find('crop');
            return new Button({
                label: new Label({
                    text: crop.getDisplayName(),
                    icon: new Icon({name: 'leaf'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('crop/' + crop.get('id'));
                    },
                },
            });
        },

        buildOutputButton: function () {
            var output = this.model.find('output');
            return new Button({
                label: new Label({
                    text: output.getDisplayName(),
                    icon: new Icon({name: 'dolly'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('output/' + output.get('id'));
                    },
                },
            });
        },

        buildEditButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model-view-page.button.edit'),
                    icon: new Icon({name: 'pencil-alt'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        this.openEditionDialog({
                            formVisible: {
                                crop_id: !_.isNull(this.model.get('crop_id')),
                                output_id: !_.isNull(this.model.get('output_id')),
                                organization_id: !_.isNull(this.model.get('organization_id')),
                            },
                            formDisabled: {
                                crop_id: true,
                                output_id: true,
                                organization_id: true,
                            },
                        });
                    }.bind(this),
                },
            });
        },

        /*---------------------------------------- Task ------------------------------------------*/
        buildTaskHtml: function () {
            return new Html({
                className: 'model-view',
                template: $('#task-page-model-template').html(),
                data: this.buildTaskHtmlData.bind(this),
            });
        },

        buildTaskHtmlData: function () {
            var category = this.model.find('category');

            return $.extend(this.model.toJSON(), {
                category: category.toJSON(),
            });
        },

        /*---------------------------------------- Features ---------------------------------------*/
        buildFeaturesTable: function () {
            return new Table({
                title: polyglot.t('task-page.features-table.title'),
                icon: new Icon({name: 'puzzle-piece'}),
                models: this.buildModels.bind(this),
                modelRow: this.buildModelRow.bind(this),
                modelForm: {
                    data: this.buildModelFormData.bind(this),
                    visible: this.buildModelFormVisible.bind(this),
                },
                onCreationClick: this.openCreationMenuPopup.bind(this),
            });
        },

        buildCreationMenuPopup: function () {
            return new MenuPopup({
                title: polyglot.t('menu-popup.title.create'),
                icon: new Icon({name: 'plus'}),
                items: this.buildCreationMenuPopupItems.bind(this),
            });
        },

        buildCreationMenuPopupItems: function () {
            var items = [],
                category = this.model.find('category');

            if (app.authentication.can('create', 'working')) {
                items.push(this.buildMenuPopupWorkingButton());
            }
            if (app.modules.has('extra-production')
                && app.authentication.can('create', 'photo')) {
                items.push(this.buildMenuPopupPhotoButton());
            }
            if (app.modules.has('advanced-production')
                && app.authentication.can('create', 'tooling')) {
                items.push(this.buildMenuPopupToolingButton());
            }
            if (_.contains(['seedling'], category.get('key'))
                && app.authentication.can('create', 'seedling')) {
                items.push(this.buildMenuPopupSeedlingButton());
            }
            if (_.contains(['transplanting'], category.get('key'))
                && app.authentication.can('create', 'transplanting')) {
                items.push(this.buildMenuPopupTransplantingButton());
            }
            if (_.contains(['planting'], category.get('key'))
                && app.authentication.can('create', 'planting')) {
                items.push(this.buildMenuPopupPlantingButton());
            }
            if (_.contains(['harvest', 'harvest_plant', 'harvest_seed'], category.get('key'))
                && app.authentication.can('create', 'output')) {
                items.push(this.buildMenuPopupOutputButton());
            }
            /*
            if (_.contains(['stage'], category.findParent().get('key'))
                && app.authentication.can('create', 'stage')) {
                items.push(this.buildMenuPopupStageButton());
            }*/

            return items;
        },

        buildMenuPopupWorkingButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model.name.working'),
                    icon: new Icon({name: 'clock'}),
                }),
                events: {
                    click: function () {
                        this.closeCreationMenuPopup('working');
                    }.bind(this),
                },
            });
        },

        buildMenuPopupPhotoButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model.name.photo'),
                    icon: new Icon({name: 'image'}),
                }),
                events: {
                    click: function () {
                        this.closeCreationMenuPopup('photo');
                    }.bind(this),
                },
            });
        },

        buildMenuPopupToolingButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model.name.tooling'),
                    icon: new Icon({name: 'wrench'}),
                }),
                events: {
                    click: function () {
                        this.closeCreationMenuPopup('tooling');
                    }.bind(this),
                },
            });
        },

        buildMenuPopupSeedlingButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model.name.seedling'),
                    icon: new Icon({name: 'map-pin'}),
                }),
                events: {
                    click: function () {
                        this.closeCreationMenuPopup('seedling');
                    }.bind(this),
                },
            });
        },

        buildMenuPopupTransplantingButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model.name.transplanting'),
                    icon: new Icon({name: 'inbox'}),
                }),
                events: {
                    click: function () {
                        this.closeCreationMenuPopup('transplanting');
                    }.bind(this),
                },
            });
        },

        buildMenuPopupPlantingButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model.name.planting'),
                    icon: new Icon({name: 'seedling'}),
                }),
                events: {
                    click: function () {
                        this.closeCreationMenuPopup('planting');
                    }.bind(this),
                },
            });
        },

        buildMenuPopupOutputButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model.name.output'),
                    icon: new Icon({name: 'dolly'}),
                }),
                events: {
                    click: function () {
                        this.closeCreationMenuPopup('output');
                    }.bind(this),
                },
            });
        },

        buildMenuPopupStageButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model.name.stage'),
                    icon: new Icon({name: 'level-up-alt'}),
                }),
                events: {
                    click: function () {
                        this.closeCreationMenuPopup('stage');
                    }.bind(this),
                },
            });
        },

        openCreationMenuPopup: function () {
            this.creationMenuPopup.open();
        },

        closeCreationMenuPopup: function (modelName) {
            this.creationMenuPopup.close();
            this.openCreationDialog(modelName);
        },

        openCreationDialog: function (modelName) {
            var dialog = app.dialogs.get(modelName);
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.' + modelName).toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData(this.buildModelFormData(modelName));
            dialog.form.setVisible(this.buildModelFormVisible(modelName));
            return dialog.open();
        },

        buildModels: function () {
            var models = [],
                category = this.model.find('category');

            models = _.union(models, app.collections.get('working').where({
                task_id: this.model.get('id'),
            }));
            if (_.contains(['seedling'], category.get('key'))) {
                models = _.union(models, app.collections.get('seedling').where({
                    task_id: this.model.get('id'),
                }));
            }
            if (_.contains(['transplanting'], category.get('key'))) {
                models = _.union(models, app.collections.get('transplanting').where({
                    task_id: this.model.get('id'),
                }));
            }
            if (_.contains(['planting'], category.get('key'))) {
                models = _.union(models, app.collections.get('planting').where({
                    task_id: this.model.get('id'),
                }));
            }
            if (_.contains(['harvest', 'harvest_plant', 'harvest_seed'], category.get('key'))) {
                models = _.union(models, app.collections.get('output').where({
                    task_id: this.model.get('id'),
                }));
            }
            if (app.modules.has('advanced-production')) {
                models = _.union(models, app.collections.get('tooling').where({
                    task_id: this.model.get('id'),
                }));
            }
            if (app.modules.has('extra-production')) {
                models = _.union(models, app.collections.get('stage').where({
                    task_id: this.model.get('id'),
                }));
            }
            if (app.modules.has('extra-production')) {
                models = _.union(models, app.collections.get('photo').where({
                    task_id: this.model.get('id'),
                }));
            }

            return models;
        },

        buildModelRow: function (model) {
            var modelName = model.collection.modelName;
            return new Html({
                tagName: 'tr',
                className: modelName,
                template: this.template[modelName],
                data: this.buildModelRowData(model),
                events: {
                    click: function () {
                        if (app.authentication.can('read', modelName)) {
                            this.navigateToModelPage(model);
                        }
                    }.bind(this),
                    taphold: function () {
                        if (app.authentication.can('update', modelName)
                        || app.authentication.can('delete', modelName)) {
                            this.openMenuPopup(model);
                        }
                    }.bind(this),
                },
            });
        },

        navigateToModelPage: function (model) {
            switch (model.collection.modelName) {
                case 'output':
                    app.router.navigate('output/' + model.get('id'));
                    break;
            }
        },

        openMenuPopup: function (model) {
            var modelName = model.collection.modelName,
                popup = app.popups.get('menu');
            popup.setData({
                title: model.getDisplayName(),
                edit: app.authentication.can('update', modelName),
                delete: app.authentication.can('delete', modelName),
            });
            popup.open().done(function (action) {
                switch (action) {
                    case 'edit': return this.openEditionDialog({
                        model: model,
                        formVisible: this.buildModelFormVisible(modelName),
                    });
                    case 'delete': return this.openDeletionPopup({
                        model: model,
                    });
                }
            }.bind(this));
        },

        buildModelRowData: function (model) {
            switch (model.collection.modelName) {
                case 'working': return model.toJSON();
                case 'photo': return model.toJSON();
                case 'tooling':
                    var entity = model.find('entity'),
                        article = model.find('article'),
                        organization = article.find('organization');
                    return $.extend(model.toJSON(), {
                        entity: entity.toJSON(),
                        article: article.toJSON(),
                        organization: _.isNull(organization) ? null : organization.toJSON(),
                    });
                case 'seedling':
                    var entity = model.find('entity'),
                        article = model.find('article'),
                        organization = article.find('organization'),
                        variety = model.find('variety'),
                        category = model.find('category'),
                        densityUnit = model.find('category', {selfAttribute: 'density_unit_id'}),
                        areaUnit = model.find('category', {selfAttribute: 'area_unit_id'});
                    return $.extend(model.toJSON(), {
                        entity: entity.toJSON(),
                        article: article.toJSON(),
                        organization: _.isNull(organization) ? null : organization.toJSON(),
                        variety: _.isNull(variety) ? null : variety.toJSON(),
                        plant: _.isNull(variety) ? null : variety.find('plant').toJSON(),
                        category: category.toJSON(),
                        density_unit: densityUnit.toJSON(),
                        area_unit: areaUnit.toJSON(),
                });
                case 'transplanting':
                    var entity = model.find('entity'),
                        article = model.find('article'),
                        organization = article.find('organization'),
                        variety = model.find('variety');
                    return $.extend(model.toJSON(), {
                        entity: entity.toJSON(),
                        article: article.toJSON(),
                        organization: _.isNull(organization) ? null : organization.toJSON(),
                        variety: _.isNull(variety) ? null : variety.toJSON(),
                        plant: _.isNull(variety) ? null : variety.find('plant').toJSON(),
                    });
                case 'planting':
                    var entity = model.find('entity'),
                        article = model.find('article'),
                        organization = article.find('organization'),
                        variety = model.find('variety'),
                        category = model.find('category');
                    return $.extend(model.toJSON(), {
                        entity: entity.toJSON(),
                        article: article.toJSON(),
                        organization: _.isNull(organization) ? null : organization.toJSON(),
                        variety: _.isNull(variety) ? null : variety.toJSON(),
                        plant: _.isNull(variety) ? null : variety.find('plant').toJSON(),
                        category: category.toJSON(),
                    });
                case 'output':
                    var article = model.find('article'),
                        category = article.find('category'),
                        quantityUnit = article.find('category', {selfAttribute: 'quantity_unit_id'}),
                        variety = model.find('variety');
                    return $.extend(model.toJSON(), {
                        article: article.toJSON(),
                        category: category.toJSON(),
                        quantity_unit: quantityUnit.toJSON(),
                        variety: _.isNull(variety) ? null : variety.toJSON(),
                        plant: _.isNull(variety) ? null : variety.find('plant').toJSON(),
                    });
                case 'stage':
                    var variety = model.find('variety');
                    return $.extend(model.toJSON(), {
                        variety: _.isNull(variety) ? null : variety.toJSON(),
                        plant: _.isNull(variety) ? null : variety.find('plant').toJSON(),
                    });
            }
        },

        buildModelFormData: function (modelName) {
            switch (modelName) {
                case 'working': return {
                    entity_id: this.model.get('entity_id'),
                    task_id: this.model.get('id'),
                    user_id: app.authentication.get('user_id'),
                    duration: '01:00:00',
                };
                case 'photo': return {
                    entity_id: this.model.get('entity_id'),
                    task_id: this.model.get('id'),
                };
                case 'tooling': return {
                    entity_id: this.model.get('entity_id'),
                    task_id: this.model.get('id'),
                };
                case 'seedling':
                    var category = app.collections.get('category').findRoot('seedling_category_id').findChild({
                        key: 'pluging',
                    }),
                    densityUnit = app.collections.get('category').findRoot('seedling_density_unit_id').findChild({
                        key: 'seed',
                    }),
                    areaUnit = app.collections.get('category').findRoot('seedling_area_unit_id').findChild({
                        key: 'plug',
                    });
                    return {
                        entity_id: this.model.get('entity_id'),
                        task_id: this.model.get('id'),
                        nursery: true,
                        category_id: category.get('id'),
                        density_unit_id: densityUnit.get('id'),
                        area_unit_id: areaUnit.get('id'),
                    };
                case 'transplanting': return {
                    entity_id: this.model.get('entity_id'),
                    task_id: this.model.get('id'),
                };
                case 'planting':
                    var category = app.collections.get('category').findRoot('planting_category_id').findChild({
                        key: 'inline',
                    });
                    return {
                        entity_id: this.model.get('entity_id'),
                        task_id: this.model.get('id'),
                        category_id: category.get('id'),
                    };
                case 'output': return {
                    entity_id: this.model.get('entity_id'),
                    task_id: this.model.get('id'),
                };
                case 'stage': return {
                    entity_id: this.model.get('entity_id'),
                    task_id: this.model.get('id'),
                };
            }
        },

        buildModelFormVisible: function (modelName) {
            switch (modelName) {
                case 'working': return {
                    task_id: false,
                    user_id: false,
                };
                case 'photo': return {
                    task_id: false,
                };
                case 'tooling': return {
                    task_id: false,
                };
                case 'seedling': return {
                    task_id: false,
                };
                case 'transplanting': return {
                    task_id: false,
                };
                case 'planting': return {
                    task_id: false,
                };
                case 'output': return {
                    task_id: false,
                };
                case 'stage': return {
                    task_id: false,
                };
            }
        },
    });
});