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
        templates: {
            working: _.template($('#task-page-working-table-row-template').html()),
            output: _.template($('#task-page-output-table-row-template').html()),
        },

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'task-page',
                title: function () {
                    return this.model.getDisplayName();
                }.bind(this),
                icon: new Icon({name: 'tasks'}),
                collection: app.collections.get('task'),
                body: this.buildBody.bind(this),
            });

            this.creationMenuPopup = this.buildCreationMenuPopup();
            this.listenTo(app.collections.get('working'), 'update', this.render);
            this.listenTo(app.collections.get('output'), 'update', this.render);
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildNavigation(),
                    this.buildTaskHtml(),
                    this.buildModelTable(),
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
            return [
                this.buildCropButton(),
                this.buildEditButton(),
            ];
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
                                crop_id: false,
                                output_id: false,
                                organization_id: false,
                                category_id: true,
                                date: true,
                                time: true,
                                description: true,
                                done: true,
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
            var crop = this.model.find('crop'),
                article = crop.find('article'),
                category = this.model.find('category');

            return $.extend(this.model.toJSON(), {
                crop: crop.toJSON(),
                article: article.toJSON(),
                category: category.toJSON(),
            });
        },

        /*---------------------------------------- Children ---------------------------------------*/
        buildModelTable: function () {
            return new Table({
                title: polyglot.t('task-page.children-table.title'),
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

            items.push(this.buildWorkingButton());
            if (category.get('key') == 'harvest') {
                items.push(this.buildOutputButton());
            }
            return items;
        },

        buildWorkingButton: function () {
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

        buildOutputButton: function () {
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
            if (category.get('key') == 'harvest') {
                models = _.union(models, app.collections.get('output').where({
                    task_id: this.model.get('id'),
                }));
            }

            return models;
        },

        buildModelRow: function (model) {
            return new Html({
                tagName: 'tr',
                template: this.templates[model.collection.modelName],
                data: this.buildModelRowData(model),
                events: {
                    taphold: function () {
                        this.openMenuPopup(model);
                    }.bind(this),
                },
            });
        },

        openMenuPopup: function (model) {
            var popup = app.popups.get('menu');
            popup.setData({
                title: model.getDisplayName(),
            });
            popup.open().done(function (action) {
                switch (action) {
                    case 'edit': return this.openEditionDialog({
                        model: model,
                        formVisible: this.buildModelFormVisible(model.collection.modelName),
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
            }
        },

        buildModelFormData: function (modelName) {
            switch (modelName) {
                case 'working': return {
                    entity_id: this.model.get('entity_id'),
                    task_id: this.model.get('id'),
                    user_id: app.authentication.getUserId(),
                    duration: '01:00:00',
                };
                case 'output': return {
                    entity_id: this.model.get('entity_id'),
                    task_id: this.model.get('id'),
                    article_id: this.model.find('crop').find('article').get('id'),
                    variety_id: null,
                };
            }
        },

        buildModelFormVisible: function (modelName) {
            switch (modelName) {
                case 'working': return {
                    duration: true,
                };
                case 'output': return {
                    article_id: true,
                    variety_id: app.modules.has('taxonomy'),
                    quantity: true,
                };
            }
        },
    });
});