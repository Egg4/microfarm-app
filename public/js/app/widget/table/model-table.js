'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/table/table',
    'app/widget/bar/table-bar',
    'lib/widget/html/html',
    'lib/widget/icon/fa-icon',
], function ($, _, Table, Bar, Html, Icon) {

    return Table.extend({

        initialize: function (options) {
            var defaults = {
                title: '',
                icon: false,
                collection: false,
                models: [],
                groupedModels: false,
                rowsGroup: this.buildRowsGroup.bind(this),
                separatorRow: {
                    options: {},
                    template: _.template('<td colspan="100"><%- separator %></td>'),
                    data: this.buildSeparatorRowData.bind(this),
                },
                modelRow: {
                    options: {},
                    template: false,
                    data: this.buildModelRowData.bind(this),
                    events: {
                        click: this.navigateToModelPage.bind(this),
                        taphold: this.openMenuPopup.bind(this),
                    },
                },
                modelForm: {
                    data: {},
                    visible: {},
                    disabled: {},
                },
                onCreationClick: this.openCreationDialog.bind(this),
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Table.prototype.initialize.call(this, $.extend(true, {
                header: this.buildHeader.bind(this),
                rows: this.buildRows.bind(this),
            }, options));
        },

        buildHeader: function () {
            var onCreationClick = this.onCreationClick;
            if (this.collection) {
                var modelName = this.collection.modelName;
                if (!app.authentication.can('create', modelName)) {
                    onCreationClick = false;
                }
            }

            return new Bar({
                title: this.title,
                icon: this.icon,
                onCreationClick: onCreationClick,
            });
        },

        openCreationDialog: function () {
            var dialog = app.dialogs.get(this.collection.modelName);
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.' + this.collection.modelName).toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            var modelFormData = _.isFunction(this.modelForm.data) ?
                this.modelForm.data() : this.modelForm.data;
            dialog.form.setData(modelFormData);
            var modelFormVisible = _.isFunction(this.modelForm.visible) ?
                this.modelForm.visible() : this.modelForm.visible;
            dialog.form.setVisible(modelFormVisible);
            var modelFormDisabled = _.isFunction(this.modelForm.disabled) ?
                this.modelForm.disabled() : this.modelForm.disabled;
            dialog.form.setDisabled(modelFormDisabled);
            dialog.open();
        },

        buildRows: function () {
            var models = _.isFunction(this.models) ? this.models() : this.models;

            if (_.isFunction(this.groupedModels)) {
                var rows = [];
                _.each(this.groupedModels(models), function (models, separator) {
                    rows = _.union(rows, this.rowsGroup(models, separator));
                }.bind(this));

                return rows;
            }

            return this.rowsGroup(models);
        },

        buildRowsGroup: function (models, separator) {
            var modelRows = _.map(models, function (model) {
                var modelRow = _.isFunction(this.modelRow) ?
                    this.modelRow(model) : this.buildModelRow(model);
                return modelRow;
            }.bind(this));

            if (separator) {
                var separatorRow = _.isFunction(this.separatorRow) ?
                    this.separatorRow(separator) : this.buildSeparatorRow(separator);
                return _.union([separatorRow], modelRows);
            }
            return modelRows;
        },

        buildSeparatorRow: function (separator) {
            var options = _.isFunction(this.separatorRow.options) ?
                this.separatorRow.options(separator) : this.separatorRow.options;

            return new Html($.extend(true, {
                tagName: 'tr',
                className: 'separator',
                attributes: {
                    'data-filtertext': ' ',
                },
                template: this.separatorRow.template,
                data: this.separatorRow.data(separator),
            }, options));
        },

        buildSeparatorRowData: function (separator) {
            return {
                separator: separator,
            };
        },

        buildModelRow: function (model) {
            var options = _.isFunction(this.modelRow.options) ?
                this.modelRow.options(model) : this.modelRow.options;

            return new Html($.extend(true, {
                tagName: 'tr',
                template: this.modelRow.template,
                data: this.modelRow.data(model),
                events: {
                    click: function () {
                        if (_.isFunction(this.modelRow.events.click)) this.modelRow.events.click(model);
                    }.bind(this),
                    taphold: function () {
                        if (_.isFunction(this.modelRow.events.taphold)) this.modelRow.events.taphold(model);
                    }.bind(this),
                },
            }, options));
        },

        buildModelRowData: function (model) {
            return model.toJSON();
        },

        navigateToModelPage: function (model) {
            var modelName = model.collection.modelName;
            if (app.authentication.can('read', modelName)) {
                app.router.navigate(modelName + '/' + model.get('id'));
            }
        },

        openMenuPopup: function (model) {
            var modelName = model.collection.modelName;
            if (!app.authentication.can('update', modelName)
                && !app.authentication.can('delete', modelName)) {
                return;
            }

            var popup = app.popups.get('menu');
            popup.setData({
                title: model.getDisplayName(),
                edit: app.authentication.can('update', modelName),
                delete: app.authentication.can('delete', modelName),
            });
            popup.open().done(function (action) {
                switch (action) {
                    case 'edit': return this.openEditionDialog(model);
                    case 'delete': return this.openDeletionPopup(model);
                }
            }.bind(this));
        },

        openEditionDialog: function (model) {
            var dialog = app.dialogs.get(model.collection.modelName);
            dialog.setData({
                title: polyglot.t('model-dialog.title.edit', {
                    model: polyglot.t('model.name.' + model.collection.modelName).toLowerCase(),
                }),
                icon: new Icon({name: 'pencil-alt'}),
            });
            dialog.form.setData(model.toJSON());
            var modelFormVisible = _.isFunction(this.modelForm.visible) ?
                this.modelForm.visible(model) : this.modelForm.visible;
            dialog.form.setVisible(modelFormVisible);
            var modelFormDisabled = _.isFunction(this.modelForm.disabled) ?
                this.modelForm.disabled(model) : this.modelForm.disabled;
            dialog.form.setDisabled(modelFormDisabled);
            dialog.open();
        },

        openDeletionPopup: function (model) {
            var popup = app.popups.get('delete');
            popup.setData({
                model: model,
            });
            popup.open();
        },
    });
});