'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'lib/widget/layout/stack-layout',
    'app/widget/form/search-form',
    'lib/widget/table/table',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, StackLayout, SearchForm, Table, Html, Button, Label, Icon) {

    return Page.extend({
        rowTemplate: _.template($('#varieties-page-variety-table-row-template').html()),

        initialize: function () {
            var searchForm = this.buildSearchForm();

            Page.prototype.initialize.call(this, {
                id: 'varietes-page',
                header: this.buildHeader(searchForm),
                body: this.buildBody(searchForm),
            });
        },

        buildHeader: function (searchForm) {
            return new Header({
                title: polyglot.t('varieties-page.title'),
                icon: new Icon({name: 'leaf'}),
                back: true,
                menu: app.panels.get('main-menu'),
                bottom: searchForm,
            });
        },

        buildBody: function (searchForm) {
            var filterId = searchForm.inputSearch.getElementId(),
                table = this.buildTable(filterId);

            this.listenTo(app.collections.get('variety'), 'update', this.render);

            return new StackLayout({
                items: [
                    table,
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
            var dialog = app.dialogs.get('variety');
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.variety').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: 1,
                active: true,
            });
            dialog.form.setVisible({

            });
            dialog.open();
        },

        buildTable: function (filterId) {
            return new Table({
                filterId: filterId,
                rows: this.buildTableRows.bind(this),
            });
        },

        buildTableRows: function () {
            var varieties = app.collections.get('variety').sortBy(function (variety) {
                return variety.getDisplayName().removeDiacritics();
            });
            var rowGroups = _.groupBy(varieties, function (variety) {
                return variety.getDisplayName().charAt(0).removeDiacritics().toUpperCase();
            });
            var rows = [];
            _.each(rowGroups, function (varieties, name) {
                rows = _.union(rows, this.buildRowGroup(name, varieties));
            }.bind(this));

            return rows;
        },

        buildRowGroup: function (name, varieties) {
            return _.union([this.buildSeparatorRow(name)], _.map(varieties, function (variety) {
                return this.buildTableRow(variety);
            }.bind(this)));
        },

        buildSeparatorRow: function (name) {
            return new Html({
                tagName: 'tr',
                className: 'separator',
                attributes: {
                    'data-filtertext': ' ',
                },
                template: '<td colspan="2"><%- name %></td>',
                data: {
                    name: name,
                },
            });
        },

        buildTableRow: function (variety) {
            return new Html({
                tagName: 'tr',
                template: this.rowTemplate,
                data: this.buildTableRowData(variety),
                events: {
                    taphold: function () {
                        this.openMenuPopup(variety);
                    }.bind(this),
                },
            });
        },

        buildTableRowData: function (variety) {
            var plant = variety.find('plant'),
                species = plant.find('species'),
                genus = species.find('genus'),
                family = genus.find('family');
            return $.extend(variety.toJSON(), {
                plant: plant.toJSON(),
                species: species.toJSON(),
                genus: genus.toJSON(),
                family: family.toJSON(),
            });
        },

        openMenuPopup: function (variety) {
            var popup = app.popups.get('menu');
            popup.setData({
                title: variety.getDisplayName(),
                items: [
                    this.buildEditionButton(popup, variety),
                    this.buildDeletionButton(popup, variety),
                ],
            });
            popup.open();
        },

        buildEditionButton: function (popup, variety) {
            return new Button({
                label: new Label({
                    text: polyglot.t('model-menu-popup.button.edit'),
                    icon: new Icon({name: 'pencil-alt'}),
                }),
                events: {
                    click: function () {
                        popup.close().done(function () {
                            this.openEditionDialog(variety);
                        }.bind(this));
                    }.bind(this),
                },
            });
        },

        openEditionDialog: function (variety) {
            var dialog = app.dialogs.get('variety');
            dialog.setData({
                title: polyglot.t('model-dialog.title.edit', {
                    model: polyglot.t('model.name.variety').toLowerCase(),
                }),
                icon: new Icon({name: 'pencil-alt'}),
            });
            dialog.form.setData(variety.toJSON());
            dialog.form.setVisible({

            });
            dialog.open();
        },

        buildDeletionButton: function (popup, variety) {
            return new Button({
                label: new Label({
                    text: polyglot.t('model-menu-popup.button.delete'),
                    icon: new Icon({name: 'trash-alt'}),
                }),
                events: {
                    click: function () {
                        popup.close().done(function () {
                            this.openDeletionPopup(variety);
                        }.bind(this));
                    }.bind(this),
                },
            });
        },

        openDeletionPopup: function (variety) {
            var popup = app.popups.get('delete');
            popup.setData({
                title: variety.getDisplayName(),
                message: polyglot.t('delete-popup.body.message', {
                    name: variety.getDisplayName(),
                }),
            });
            popup.open().done(function () {
                app.loader.show();
                variety.destroy({
                    success: function () {
                        app.loader.hide();
                    },
                });
            });
        },
    });
});