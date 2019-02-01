'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'app/widget/bar/footer-bar',
    'lib/widget/layout/border-layout',
    'app/widget/popup/menu-popup',
    'lib/widget/table/table',
    'lib/widget/table/row/table-row',
    'lib/widget/table/cell/table-cell',
    'lib/widget/list/list',
    'lib/widget/list/item/item',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, Footer, BorderLayout, MenuPopup, Table, Row, Cell, List, ListItem, Html, Button, Label, Icon) {

    return Page.extend({
        template: {
            header: _.template($('#planner-page-header-template').html()),
            crop: _.template($('#planner-page-crop-task-template').html()),
            output: _.template($('#planner-page-output-task-template').html()),
        },

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'planner-page',
                header: this.buildHeader.bind(this),
                body: this.buildPlannerBody.bind(this),
                footer: this.buildFooter.bind(this),
                events: {
                    swipeleft: function () {
                        this.monday.addDays(7);
                        this.render();
                    }.bind(this),
                    swiperight: function() {
                        this.monday.addDays(-7);
                        this.render();
                    }.bind(this),
                },
            });

            this.taskCreationMenuPopup = this.buildTaskCreationMenuPopup();
            this.listenTo(app.collections.get('task'), 'update', this.render);
        },

        /*---------------------------------------- Header ---------------------------------------*/
        buildHeader: function () {
            return new Header({
                title: this.buildHeaderTitle.bind(this),
                icon: new Icon({name: 'calendar-alt'}),
                back: true,
                menu: app.panels.get('main-menu'),
                bottom: this.buildPlannerHeader.bind(this),
            });
        },

        buildHeaderTitle: function () {
            var monthDate = new Date();
            monthDate.setDate(1);
            monthDate.setMonth(this.monday.getWeekMonth());

            return polyglot.t('planner-page.title', {
                week: this.monday.getWeek(),
                month: polyglot.t('date.month.' + monthDate.format('M').toLowerCase()),
                year: this.monday.getWeekYear(),
            });
        },

        /*---------------------------------------- Planner header ---------------------------------------*/
        buildPlannerHeader: function () {
            var dates = _.map(_.range(0, 7, 1), function (index) {
                var date = new Date(this.monday);
                date.addDays(index);
                return date;
            }.bind(this));

            return new Table({
                className: 'planner-table-header',
                rows: [
                    new Row({
                        cells: _.map(dates, this.buildPlannerHeaderCell.bind(this)),
                    }),
                ],
            });
        },

        buildPlannerHeaderCell: function (date) {
            return new Html({
                tagName: 'td',
                template: this.template.header,
                data: {
                    weekDay:  polyglot.t('date.day.' + date.format('D').toLowerCase()),
                    monthDay: date.format('d'),
                },
                events: {
                    click: function () {
                        this.openTaskCreationMenuPopup(date);
                    }.bind(this),
                },
            });
        },

        /*---------------------------------------- Task creation ---------------------------------------*/
        buildTaskCreationMenuPopup: function () {
            return new MenuPopup({
                title: polyglot.t('menu-popup.title.create'),
                icon: new Icon({name: 'plus'}),
                items: this.buildTaskCreationMenuPopupItems.bind(this),
            });
        },

        buildTaskCreationMenuPopupItems: function () {
            return [
                this.buildTaskCreationMenuPopupCropButton(),
                this.buildTaskCreationMenuPopupOutputButton(),
            ];
        },

        buildTaskCreationMenuPopupCropButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('planner-page.task-creation.button', {
                        type: polyglot.t('model.name.crop').toLowerCase(),
                    }),
                    icon: new Icon({name: 'leaf'}),
                }),
                events: {
                    click: function () {
                        this.closeTaskCreationMenuPopup('crop');
                    }.bind(this),
                },
            });
        },

        buildTaskCreationMenuPopupOutputButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('planner-page.task-creation.button', {
                        type: polyglot.t('model.name.output').toLowerCase(),
                    }),
                    icon: new Icon({name: 'dolly'}),
                }),
                events: {
                    click: function () {
                        this.closeTaskCreationMenuPopup('output');
                    }.bind(this),
                },
            });
        },

        openTaskCreationMenuPopup: function (date) {
            this.taskCreationDate = date;
            this.taskCreationMenuPopup.open();
        },

        closeTaskCreationMenuPopup: function (modelName) {
            this.taskCreationMenuPopup.close();
            this.openTaskCreationDialog(this.taskCreationDate, modelName);
        },

        openTaskCreationDialog: function (date, modelName) {
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
                crop_id: modelName === 'crop' ? '' : null,
                output_id: modelName === 'output' ? '' : null,
                organization_id: modelName === 'organization' ? '' : null,
                date: date.format('yy-mm-dd'),
                time: (now.getHours() + now.getTimezoneOffset() / 60).pad(2) + ':00:00',
            });
            dialog.form.setVisible({
                crop_id: (modelName === 'crop'),
                output_id: (modelName === 'output'),
                organization_id: (modelName === 'organization'),
                category_id: true,
                date: true,
                time: true,
                description: true,
                done: true,
            });
            dialog.open();
        },

        /*---------------------------------------- Planner body ---------------------------------------*/
        buildPlannerBody: function () {
            var dates = _.map(_.range(0, 7, 1), function (index) {
                var date = new Date(this.monday);
                date.addDays(index);
                return date;
            }.bind(this));

            return new Table({
                className: 'planner-table-body',
                rows: [
                    new Row({
                        cells: _.map(dates, this.buildPlannerBodyCell.bind(this)),
                    }),
                ],
            });
        },

        buildPlannerBodyCell: function (date) {
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
                template: this.template[this.getTaskType(task)],
                data: this.buildTaskHtmlData(task),
                events: {
                    click: function () {
                        app.router.navigate('task/' + task.get('id'));
                    },
                    taphold: function () {
                        this.openTaskMenuPopup(task);
                    }.bind(this),
                },
            });
            $(html.el).addClass(task.get('done') ? 'done' : 'undone');

            if (task.get('date') < this.monday.format('yy-mm-dd')) {
                $(html.el).addClass('reported');
            }

            return html;
        },

        getTaskType: function (task) {
            if (!_.isNull(task.get('crop_id'))) return 'crop';
            if (!_.isNull(task.get('output_id'))) return 'output';
            if (!_.isNull(task.get('organization_id'))) return 'organization';
        },

        buildTaskHtmlData: function (task) {
            var category = task.find('category');

            switch (this.getTaskType(task)) {
                case 'crop':
                    var crop = task.find('crop'),
                        article = crop.find('article');
                    return $.extend(task.toJSON(), {
                        crop: crop.toJSON(),
                        article: article.toJSON(),
                        category: category.toJSON(),
                    });
                case 'output':
                    var output = task.find('output'),
                        article = output.find('article'),
                        variety = output.find('variety');
                    return $.extend(task.toJSON(), {
                        output: output.toJSON(),
                        article: article.toJSON(),
                        category: category.toJSON(),
                        variety: _.isNull(variety) ? null : variety.toJSON(),
                        plant: _.isNull(variety) ? null : variety.find('plant').toJSON(),
                    });
            }
        },

        openTaskMenuPopup: function (task) {
            var suffix = '';
            switch (this.getTaskType(task)) {
                case 'crop':
                    suffix = task.find('crop').getDisplayName();
                    break;
                case 'output':
                    suffix = task.find('output').getDisplayName();
                    break;
            }

            var popup = app.popups.get('menu');
            popup.setData({
                title: task.getDisplayName() + ' - ' + suffix,
            });
            popup.open().done(function (action) {
                switch (action) {
                    case 'edit': return this.openTaskEditionDialog(task);
                    case 'delete': return this.openTaskDeletionPopup(task);
                }
            }.bind(this));
        },

        openTaskEditionDialog: function (task) {
            var dialog = app.dialogs.get('task');
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

        openTaskDeletionPopup: function (task) {
            var suffix = '';
            switch (this.getTaskType(task)) {
                case 'crop':
                    suffix = task.find('crop').getDisplayName();
                    break;
                case 'output':
                    suffix = task.find('output').getDisplayName();
                    break;
            }

            var popup = app.popups.get('delete');
            popup.setData({
                title: task.getDisplayName() + ' - ' + suffix,
                model: task,
            });
            popup.open();
        },

        /*---------------------------------------- Footer ---------------------------------------*/
        buildFooter: function () {
            return new Footer({
                layout: new BorderLayout({
                    center: this.buildFooterLabel(),
                }),
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

        setData: function () {
            if (_.isUndefined(this.monday)) {
                this.monday = new Date().getMonday();
            }
        },
    });
});