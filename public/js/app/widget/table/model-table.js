'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/table/table',
    'app/widget/bar/table-bar',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Table, Bar, Html, Button, Label, Icon) {

    return Table.extend({

        initialize: function (options) {
            var defaults = {
                title: '',
                icon: false,
                collection: false,
                models: [],
                row: this.buildRow.bind(this),
                rowTemplate: false,
                rowData: this.buildRowData.bind(this),
                onCreationClick: this.openCreationDialog.bind(this),
                onRowClick: this.navigateToModelPage.bind(this),
                onRowHold: this.openMenuPopup.bind(this),
                modelFormData: this.getModelFormData.bind(this),
                modelFormVisible: this.getModelFormVisible.bind(this),
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Table.prototype.initialize.call(this, $.extend(true, {
                header: this.buildHeader.bind(this),
                rows: this.buildRows.bind(this),
            }, options));
        },

        buildHeader: function () {
            return new Bar({
                title: this.title,
                icon: this.icon,
                onCreationClick: this.onCreationClick,
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
            var modelFormData = _.isFunction(this.modelFormData) ? this.modelFormData() : this.modelFormData;
            dialog.form.setData(modelFormData);
            var modelFormVisible = _.isFunction(this.modelFormVisible) ? this.modelFormVisible() : this.modelFormVisible;
            dialog.form.setVisible(modelFormVisible);
            dialog.open();
        },

        buildRows: function () {
            var models = _.isFunction(this.models) ? this.models() : this.models;
            return _.map(models, function (model) {
                return this.row(model);
            }.bind(this));
        },

        buildRow: function (model) {
            return new Html({
                tagName: 'tr',
                template: this.rowTemplate,
                data: this.rowData(model),
                events: {
                    click: function () {
                        if (this.onRowClick) this.onRowClick(model);
                    }.bind(this),
                    taphold: function () {
                        if (this.onRowHold) this.onRowHold(model);
                    }.bind(this),
                },
            });
        },

        buildRowData: function (model) {
            return model.toJSON();
        },

        navigateToModelPage: function (model) {
            app.router.navigate(this.collection.modelName + '/' + model.get('id'));
        },

        openMenuPopup: function (model) {
            var popup = app.popups.get('menu');
            popup.setData({
                title: model.getDisplayName(),
            });
            popup.open().done(function (action) {
                switch (action) {
                    case 'edit': return this.openEditionDialog(model);
                    case 'delete': return this.openDeletionPopup(model);
                }
            }.bind(this));
        },

        openEditionDialog: function (model) {
            var dialog = app.dialogs.get(this.collection.modelName);
            dialog.setData({
                title: polyglot.t('model-dialog.title.edit', {
                    model: polyglot.t('model.name.' + this.collection.modelName).toLowerCase(),
                }),
                icon: new Icon({name: 'pencil-alt'}),
            });
            dialog.form.setData(model.toJSON());
            var modelFormVisible = _.isFunction(this.modelFormVisible) ? this.modelFormVisible() : this.modelFormVisible;
            dialog.form.setVisible(modelFormVisible);
            dialog.open();
        },

        openDeletionPopup: function (model) {
            var popup = app.popups.get('delete');
            popup.setData({
                model: model,
            });
            popup.open();
        },

        getModelFormData: function () {
            return {};
        },

        getModelFormVisible: function () {
            return {};
        },
    });
});