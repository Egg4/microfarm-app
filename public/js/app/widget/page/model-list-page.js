'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'lib/widget/layout/stack-layout',
    'app/widget/form/search-form',
    'lib/widget/table/table',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, StackLayout, SearchForm, Table, Html, Button, Label, Icon) {

    return Page.extend({

        initialize: function (options) {
            var defaults = {
                collection: false,
                separatorRowTemplate: false,
                modelRowTemplate: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            var searchForm = this.buildSearchForm();

            Page.prototype.initialize.call(this, {
                header: this.buildHeader(searchForm),
                body: this.buildBody(searchForm),
            });
        },

        buildHeader: function (searchForm) {
            return false;
        },

        buildBody: function (searchForm) {
            return new StackLayout({
                items: [
                    this.buildTable(searchForm),
                ],
            });
        },

        buildSearchForm: function () {
            return new SearchForm({
                buttons: [
                    this.buildCreationButton(),
                ],
            });
        },

        buildCreationButton: function () {
            return new Button({
                label: new Label({
                    icon: new Icon({name: 'plus'}),
                }),
                events: {
                    click: function () {
                        this.openCreationDialog();
                    }.bind(this),
                },
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
            dialog.form.setData(this.getModelFormData());
            dialog.form.setVisible(this.getModelFormVisible());
            dialog.open();
        },

        buildTable: function (searchForm) {
            var filterId = searchForm.inputSearch.getElementId();

            return new Table({
                filterId: filterId,
                rows: this.buildRows.bind(this),
            });
        },

        buildRows: function () {
            return [];
        },

        buildRowGroup: function (separator, models) {
            return _.union([this.buildSeparatorRow(separator)], _.map(models, function (model) {
                return this.buildModelRow(model);
            }.bind(this)));
        },

        buildSeparatorRow: function (separator) {
            return new Html({
                tagName: 'tr',
                className: 'separator',
                attributes: {
                    'data-filtertext': ' ',
                },
                template: this.separatorRowTemplate,
                data: {
                    separator: separator,
                },
            });
        },

        buildModelRow: function (model) {
            return new Html({
                tagName: 'tr',
                template: this.modelRowTemplate,
                data: this.buildModelRowData(model),
                events: {
                    click: function () {
                        this.navigateToModelPage(model);
                    }.bind(this),
                    taphold: function () {
                        this.openMenuPopup(model);
                    }.bind(this),
                },
            });
        },

        buildModelRowData: function (model) {
            return model.toJSON();
        },

        navigateToModelPage: function (model) {

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
            dialog.form.setVisible(this.getModelFormVisible());
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