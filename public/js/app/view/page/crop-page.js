'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/model-view-page',
    'app/widget/bar/header-bar',
    'lib/widget/layout/stack-layout',
    'app/widget/table/model-table',
    'lib/widget/html/html',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, StackLayout, Table, Html, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'crop-page',
            });

            this.listenTo(app.collections.get('task'), 'update', this.render);
        },

        buildHeader: function () {
            return new Header({
                title: function () {
                    return this.model.getDisplayName();
                }.bind(this),
                icon: new Icon({name: 'leaf'}),
                back: true,
                menu: app.panels.get('main-menu'),
            });
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildModelHtml(),
                    this.buildTaskTable(),
                ],
            });
        },

        buildModelHtml: function () {
            return new Html({
                template: $('#crop-page-model-template').html(),
                data: function () {
                    return this.buildModelHtmlData();
                }.bind(this),
            });
        },

        buildModelHtmlData: function () {
            var article = this.model.find('article');
            return $.extend(this.model.toJSON(), {
                article: article.toJSON(),
            });
        },

        buildTaskTable: function () {
            return new Table({
                title: polyglot.t('crop-page.task-table.title'),
                icon: new Icon({name: 'tasks'}),
                collection: app.collections.get('task'),
                models: this.buildTasks.bind(this),
                row: this.buildTaskRow.bind(this),
                rowTemplate: _.template($('#crop-page-task-table-row-template').html()),
                rowData: this.buildTaskRowData.bind(this),
                onRowClick: false,
                modelFormData: this.getTaskFormData.bind(this),
                modelFormVisible: this.getTaskFormVisible.bind(this),
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

        buildTaskRow: function (task) {
            var row = this.body.items[1].buildRow(task);
            if (!task.get('done')) $(row.el).addClass('disabled');
            return row;
        },

        buildTaskRowData: function (task) {
            var category = task.find('category');
            return $.extend(task.toJSON(), {
                category: category.toJSON(),
            });
        },

        getTaskFormData: function () {
            return {
                entity_id: this.model.get('entity_id'),
                crop_id: this.model.get('id'),
            };
        },

        getTaskFormVisible: function () {
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

        setData: function (id) {
            if (this.model) this.stopListening(this.model);
            this.model = app.collections.get('crop').get(id);
            this.listenTo(this.model, 'update', this.render);
        },
    });
});