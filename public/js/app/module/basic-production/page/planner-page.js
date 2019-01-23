'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'app/widget/bar/footer-bar',
    'lib/widget/layout/border-layout',
    'lib/widget/table/table',
    'lib/widget/table/row/table-row',
    'lib/widget/table/cell/table-cell',
    'lib/widget/list/list',
    'lib/widget/list/item/item',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, Footer, BorderLayout, Table, Row, Cell, List, ListItem, Html, Button, Label, Icon) {

    return Page.extend({
        headerTemplate: _.template($('#planner-page-header-template').html()),
        taskTemplate: _.template($('#planner-page-task-template').html()),

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'planner-page',
                header: this.buildHeader.bind(this),
                body: this.buildBody.bind(this),
                footer: this.buildFooter.bind(this),
            });

            this.listenTo(app.collections.get('task'), 'update', this.render);
        },

        buildHeader: function () {
            return new Header({
                title: this.buildHeaderTitle.bind(this),
                icon: new Icon({name: 'calendar-alt'}),
                back: true,
                menu: app.panels.get('main-menu'),
                bottom: this.buildHeaderTable.bind(this),
            });
        },

        buildHeaderTitle: function () {
            var monthDate = new Date();
            monthDate.setMonth(this.monday.getWeekMonth());

            return polyglot.t('planner-page.title', {
                week: this.monday.getWeek(),
                month: polyglot.t('date.month.' + monthDate.format('M').toLowerCase()),
                year: this.monday.getWeekYear(),
            });
        },

        buildHeaderTable: function () {
            var dates = _.map(_.range(0, 7, 1), function (index) {
                var date = new Date(this.monday);
                date.addDays(index);
                return date;
            }.bind(this));

            return new Table({
                className: 'planner-table-header',
                rows: [
                    new Row({
                        cells: _.map(dates, this.buildHeaderCell.bind(this)),
                    }),
                ],
            });
        },

        buildHeaderCell: function (date) {
            return new Html({
                tagName: 'td',
                template: this.headerTemplate,
                data: {
                    weekDay:  polyglot.t('date.day.' + date.format('D').toLowerCase()),
                    monthDay: date.format('d'),
                },
                events: {
                    taphold: function () {
                        this.openCreationDialog(date);
                    }.bind(this),
                },
            });
        },

        openCreationDialog: function (date) {
            var now = new Date(),
                dialog = app.dialogs.get('task');
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.task').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: app.authentication.getEntityId(),
                date: date.format('yy-mm-dd'),
                time: (now.getHours() + now.getTimezoneOffset() / 60) + ':00:00',
            });
            dialog.form.setVisible({
                crop_id: true,
                output_id: false,
                organization_id: false,
                category_id: true,
                date: true,
                time: true,
                description: true,
                done: true,
            });
            dialog.open();
        },

        buildBody: function () {
            var dates = _.map(_.range(0, 7, 1), function (index) {
                var date = new Date(this.monday);
                date.addDays(index);
                return date;
            }.bind(this));

            return new Table({
                className: 'planner-table-body',
                rows: [
                    new Row({
                        cells: _.map(dates, this.buildBodyCell.bind(this)),
                    }),
                ],
            });
        },

        buildBodyCell: function (date) {
            return new Cell({
                content: this.buildTaskList(date),
            });
        },

        buildTaskList: function (date) {
            var dateISO = date.format('yy-mm-dd'),
                currentMondayISO = new Date().getMonday().format('yy-mm-dd'),
                mondayISO = this.monday.format('yy-mm-dd');

            var tasks = app.collections.get('task').where({
                date: dateISO,
            });
            // If current week add previous undone tasks on monday
            if (date.getDay() == 1 && mondayISO == currentMondayISO) {
                app.collections.get('task').each(function (task) {
                    if (!task.get('done') && task.get('date') < dateISO) {
                        tasks.push(task);
                    };
                });
            }

            // Sort asc tasks by date & time
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
            var html = new Html({
                className: 'task',
                template: this.taskTemplate,
                data: this.buildTaskHtmlData(task),
                events: {
                    click: function () {
                        app.router.navigate('task/' + task.get('id'));
                    },
                    taphold: function () {
                        this.openMenuPopup(task);
                    }.bind(this),
                },
            });
            $(html.el).addClass(task.get('done') ? 'done' : 'undone');

            if (task.get('date') < this.monday.format('yy-mm-dd')) {
                $(html.el).addClass('reported');
            }

            return html;
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

        openMenuPopup: function (task) {
            var crop = task.find('crop'),
                article = crop.find('article'),
                popup = app.popups.get('menu');

            popup.setData({
                title: task.getDisplayName() + ' - ' + article.get('name') + ' ' + crop.get('number'),
            });
            popup.open().done(function (action) {
                switch (action) {
                    case 'edit': return this.openEditionDialog(task);
                    case 'delete': return this.openDeletionPopup(task);
                }
            }.bind(this));
        },

        openEditionDialog: function (task) {
            var crop = task.find('crop'),
                article = crop.find('article'),
                dialog = app.dialogs.get('task');

            dialog.setData({
                title: polyglot.t('model-dialog.title.edit', {
                    model: polyglot.t('model.name.task').toLowerCase(),
                }),
                icon: new Icon({name: 'pencil-alt'}),
            });
            dialog.form.setData(task.toJSON());
            dialog.form.setVisible({
                crop_id: false,
                output_id: false,
                organization_id: false,
                category_id: true,
                date: true,
                time: true,
                description: true,
                done: true,
            });
            dialog.open();
        },

        openDeletionPopup: function (task) {
            var crop = task.find('crop'),
                article = crop.find('article'),
                popup = app.popups.get('delete');

            popup.setData({
                title: task.getDisplayName() + ' - ' + article.get('name') + ' ' + crop.get('number'),
                model: task,
            });
            popup.open();
        },

        buildFooter: function () {
            return new Footer({
                layout: new BorderLayout({
                    left: this.buildFooterPreviousButton(),
                    center: this.buildFooterLabel(),
                    right: this.buildFooterNextButton(),
                }),
            });
        },

        buildFooterPreviousButton: function () {
            return new Button({
                label: new Label({
                    icon: new Icon({name: 'angle-left'}),
                }),
                events: {
                    click: function() {
                        this.monday.addDays(-7);
                        this.render();
                    }.bind(this),
                },
            });
        },

        buildFooterLabel: function () {
            return new Label({
                className: 'ui-title',
                text: polyglot.t('date.today'),
                icon: new Icon({name: 'calendar-check'}),
                events: {
                    click: function() {
                        this.monday = new Date().getMonday();
                        this.render();
                    }.bind(this),
                },
            });
        },

        buildFooterNextButton: function () {
            return new Button({
                label: new Label({
                    icon: new Icon({name: 'angle-right'}),
                }),
                events: {
                    click: function() {
                        this.monday.addDays(7);
                        this.render();
                    }.bind(this),
                },
            });
        },

        setData: function () {
            if (_.isUndefined(this.monday)) {
                this.monday = new Date().getMonday();
            }
        },
    });
});