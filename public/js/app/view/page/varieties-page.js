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
                menu: false,
                bottom: searchForm,
            });
        },

        buildBody: function (searchForm) {
            var filterId = searchForm.inputSearch.getElementId(),
                table = this.buildTable(filterId);

            this.listenTo(app.collections.get('variety'), 'update', table.render);

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
                    click: this.showCreationDialog.bind(this),
                },
            });
        },

        showCreationDialog: function () {
            var dialog = app.dialogs.get('variety');
            dialog.setData({
                title: polyglot.t('model-dialog.title.edit', {
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
            return app.collections.get('variety').map(function (variety) {
                return this.buildTableRow(variety);
            }.bind(this));
        },

        buildTableRow: function (variety) {
            return new Html({
                tagName: 'tr',
                template: this.rowTemplate,
                data: this.buildTableRowData(variety),
                events: {
                    taphold: function () {
                        console.log('show variety menu');
                    },
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
    });
});