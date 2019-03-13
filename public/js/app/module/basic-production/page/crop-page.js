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
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, StackLayout, Navigation, GridLayout, Html, Table, Button, Label, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'crop-page',
                title: function () {
                    return this.model.getDisplayName();
                }.bind(this),
                icon: new Icon({name: 'leaf'}),
                collection: app.collections.get('crop'),
                body: this.buildBody.bind(this),
            });

            this.listenTo(app.collections.get('task'), 'update', this.render);
            if (app.modules.has('land')) {
                this.listenTo(app.collections.get('crop_location'), 'update', this.render);
                this.listenTo(app.collections.get('zone'), 'update', this.render);
                this.listenTo(app.collections.get('block'), 'update', this.render);
                this.listenTo(app.collections.get('bed'), 'update', this.render);
            }
        },

        buildBody: function () {
            var items = [];
            items.push(this.buildNavigation());
            items.push(this.buildTaskTable());
            if (app.modules.has('land')) {
                items.push(this.buildLocationTable());
            }

            return new StackLayout({
                items: items,
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
            if (app.authentication.can('read', 'crop')) {
                buttons.push(this.buildCropsButton());
            }
            if (app.authentication.can('read', 'article')) {
                buttons.push(this.buildArticleButton());
            }
            if (app.authentication.can('update', 'crop')) {
                buttons.push(this.buildEditButton());
            }

            return buttons;
        },

        buildCropsButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('crops-page.title'),
                    icon: new Icon({name: 'leaf'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('crops');
                    }.bind(this),
                },
            });
        },

        buildArticleButton: function () {
            var article = this.model.find('article');
            return new Button({
                label: new Label({
                    text: article.getDisplayName(),
                    icon: new Icon({name: 'shopping-cart'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('article/' + article.get('id'));
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
                                article_id: true,
                                number: true,
                            },
                        });
                    }.bind(this),
                },
            });
        },

        /*---------------------------------------- Task ------------------------------------------*/
        buildTaskTable: function () {
            return new Table({
                title: polyglot.t('crop-page.task-table.title'),
                icon: new Icon({name: 'tasks'}),
                collection: app.collections.get('task'),
                models: this.buildTasks.bind(this),
                modelRow: {
                    options: this.buildTaskRowOptions.bind(this),
                    template: _.template($('#crop-page-task-table-row-template').html()),
                    data: this.buildTaskRowData.bind(this),
                },
                modelForm: {
                    data: this.buildTaskFormData.bind(this),
                    visible: this.buildTaskFormVisible.bind(this),
                    disabled: this.buildTaskFormDisabled.bind(this),
                },
            });
        },

        buildTasks: function () {
            var tasks = app.collections.get('task').where({
                crop_id: this.model.get('id'),
            });

            return _.sortBy(tasks, function (task) {
                return task.get('date') + task.get('time');
            }).reverse();
        },

        buildTaskRowOptions: function (task) {
            return {
                className: task.get('done') ? 'done' : '',
            };
        },

        buildTaskRowData: function (task) {
            var category = task.find('category');
            return $.extend(task.toJSON(), {
                category: category.toJSON(),
            });
        },

        buildTaskFormData: function () {
            return {
                entity_id: this.model.get('entity_id'),
                crop_id: this.model.get('id'),
            };
        },

        buildTaskFormVisible: function () {
            return {
                output_id: false,
                organization_id: false,
            };
        },

        buildTaskFormDisabled: function () {
            return {
                crop_id: true,
            };
        },

        /*---------------------------------------- Location -------------------------------------*/
        buildLocationTable: function () {
            return new Table({
                title: polyglot.t('crop-page.crop_location-table.title'),
                icon: new Icon({name: 'map-marker-alt'}),
                collection: app.collections.get('crop_location'),
                models: this.buildLocations.bind(this),
                modelRow: {
                    template: _.template($('#crop-page-crop_location-table-row-template').html()),
                    data: this.buildLocationRowData.bind(this),
                    events: {
                        click: false,
                    },
                },
                modelForm: {
                    data: this.buildLocationFormData.bind(this),
                    visible: this.buildLocationFormVisible.bind(this),
                },
            });
        },

        buildLocations: function () {
            var cropLocations = app.collections.get('crop_location').where({
                crop_id: this.model.get('id'),
            });

            return _.sortBy(cropLocations, function (cropLocation) {
                return cropLocation.get('id');
            });
        },

        buildLocationRowData: function (cropLocation) {
            var zone = cropLocation.find('zone'),
                block = cropLocation.find('block'),
                bed = cropLocation.find('bed');
            return $.extend(cropLocation.toJSON(), {
                zone: zone.toJSON(),
                block: _.isNull(block) ? null : block.toJSON(),
                bed: _.isNull(bed) ? null : bed.toJSON(),
            });
        },

        buildLocationFormData: function () {
            return {
                entity_id: this.model.get('entity_id'),
                crop_id: this.model.get('id'),
            };
        },

        buildLocationFormVisible: function () {
            return {
                crop_id: false,
                zone_id: true,
                block_id: true,
                bed_id: true,
            };
        },
    });
});