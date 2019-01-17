'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'lib/widget/table/table',
    'lib/widget/table/row/table-row',
    'lib/widget/table/cell/table-cell',
    'lib/widget/list/list',
    'lib/widget/list/item/item',
    'lib/widget/html/html',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, Table, Row, Cell, List, ListItem, Html, Icon) {

    return Page.extend({
        headerTemplate: _.template($('#planner-page-header-template').html()),
        taskTemplate: _.template($('#planner-page-task-template').html()),

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'planner-page',
                header: new Header({
                    title: this.buildTitle.bind(this),
                    icon: new Icon({name: 'calendar-alt'}),
                    back: true,
                    menu: app.panels.get('main-menu'),
                }),
                body: this.buildBody.bind(this),
            });

            this.listenTo(app.collections.get('task'), 'update', this.render);
        },

        buildTitle: function () {
            return polyglot.t('planner-page.title', {
                week: this.week,
            }) + ' ' + this.monday.format('M yy');
        },

        buildBody: function () {
            return new Table({
                rows: this.buildRows.bind(this),
            });
        },

        buildRows: function () {
            var dates = _.map(_.range(0, 7, 1), function (index) {
                var date = new Date(this.monday.getTime());
                date.addDays(index);
                return date;
            }.bind(this));

            return [
                this.buildHeader(dates),
                this.buildRow(dates),
            ];
        },

        buildHeader: function (dates) {
            return new Row({
                cells: _.map(dates, this.buildHeaderCell.bind(this)),
            });
        },

        buildHeaderCell: function (date) {
            return new Html({
                tagName: 'td',
                template: this.headerTemplate,
                data: {
                    weekDay: date.format('D'),
                    monthDay: date.format('d'),
                },
            });
        },

        buildRow: function (dates) {
            return new Row({
                cells: _.map(dates, this.buildRowCell.bind(this)),
            });
        },

        buildRowCell: function (date) {
            return new Cell({
                content: this.buildTaskList(date),
            });
        },

        buildTaskList: function (date) {
            var tasks = app.collections.get('task').where({
                date: date.format('yy-mm-dd'),
            });
            tasks = _.sortBy(tasks, function (task) {
                return task.get('date') + task.get('time');
            });

            return new List({
                items: _.map(tasks, this.buildTaskListItem.bind(this)),
            });
        },

        buildTaskListItem: function (task) {
            return new ListItem({
                content: this.buildTaskHtml(task),
            });
        },

        buildTaskHtml: function (task) {
            return new Html({
                className: task.get('done') ? '' : 'disabled',
                template: this.taskTemplate,
                data: this.buildTaskHtmlData(task),
            });
        },

        buildTaskHtmlData: function (task) {
            var crop = task.find('crop'),
                article = crop.find('article'),
                category = task.find('category');
            return $.extend(task.toJSON(), {
                crop: crop.toJSON(),
                article: article.toJSON(),
                category: category.toJSON(),
            });
        },

        setData: function () {
            var date = new Date();
            this.week = date.getWeekOfYear();
            this.monday = Date.getWeekMonday(this.week, date.getFullYear());
        },
    });
});