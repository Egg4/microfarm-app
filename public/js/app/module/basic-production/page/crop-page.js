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
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildNavigation(),
                    this.buildCropHtml(),
                    this.buildTaskTable(),
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
                this.buildArticleButton(),
                this.buildEditButton(),
            ];
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

        /*---------------------------------------- Crop ------------------------------------------*/
        buildCropHtml: function () {
            return new Html({
                template: $('#crop-page-model-template').html(),
                data: function () {
                    return this.buildCropHtmlData();
                }.bind(this),
            });
        },

        buildCropHtmlData: function () {
            var article = this.model.find('article');
            return $.extend(this.model.toJSON(), {
                article: article.toJSON(),
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
                crop_id: false,
                output_id: false,
                organization_id: false,
                category_id: true,
                date: true,
                time: true,
                description: true,
                done: true,
            };
        },
    });
});