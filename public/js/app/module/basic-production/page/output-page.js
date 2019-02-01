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
                id: 'output-page',
                title: this.buildTitle.bind(this),
                icon: new Icon({name: 'dolly'}),
                collection: app.collections.get('output'),
                body: this.buildBody.bind(this),
            });

            this.listenTo(app.collections.get('task'), 'update', this.render);
        },

        buildTitle: function () {
            var outputName = this.model.find('article').getDisplayName().toLowerCase();
            return polyglot.t('model.name.output') + ' ' + outputName;
        },

        buildBody: function () {
            var items = [];
            items.push(this.buildNavigation());
            items.push(this.buildOutputHtml());
            items.push(this.buildTaskTable());

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
            return [
                this.buildTaskButton(),
                this.buildArticleButton(),
                this.buildEditButton(),
            ];
        },

        buildTaskButton: function () {
            var task = this.model.find('task');
            return new Button({
                label: new Label({
                    text: task.getDisplayName(),
                    icon: new Icon({name: 'tasks'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('task/' + task.get('id'));
                    },
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
                                task_id: false,
                                article_id: true,
                                variety_id: true,
                                quantity: true,
                            },
                        });
                    }.bind(this),
                },
            });
        },

        /*---------------------------------------- Output ----------------------------------------*/
        buildOutputHtml: function () {
            return new Html({
                className: 'model-view',
                template: $('#output-page-model-template').html(),
                data: this.buildOutputHtmlData.bind(this),
            });
        },

        buildOutputHtmlData: function () {
            var task = this.model.find('task'),
                article = this.model.find('article'),
                category = article.find('category'),
                quantityUnit = article.find('category', {selfAttribute: 'quantity_unit_id'}),
                variety = this.model.find('variety');
            return $.extend(this.model.toJSON(), {
                task: task.toJSON(),
                article: article.toJSON(),
                category: category.toJSON(),
                quantity_unit: quantityUnit.toJSON(),
                variety: _.isNull(variety) ? null : variety.toJSON(),
                plant: _.isNull(variety) ? null : variety.find('plant').toJSON(),
            });
        },

        /*---------------------------------------- Task ------------------------------------------*/
        buildTaskTable: function () {
            return new Table({
                title: polyglot.t('output-page.task-table.title'),
                icon: new Icon({name: 'tasks'}),
                collection: app.collections.get('task'),
                models: this.buildTasks.bind(this),
                modelRow: {
                    options: this.buildTaskRowOptions.bind(this),
                    template: _.template($('#output-page-task-table-row-template').html()),
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
                output_id: this.model.get('id'),
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
            var task = this.model.find('task');
            return {
                entity_id: this.model.get('entity_id'),
                output_id: this.model.get('id'),
                date: task.get('date'),
                time: (parseInt(task.get('time').substring(0, 2)) + 1).pad(2) + ':00:00',
                done: false,
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