'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/model-list-page',
    'app/widget/bar/header-bar',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'varieties-page',
                collection: app.collections.get('variety'),
                separatorRowTemplate: _.template('<td colspan="2"><%- separator %></td>'),
                modelRowTemplate: _.template($('#varieties-page-variety-table-row-template').html()),
            });

            this.listenTo(this.collection, 'update', this.render);
        },

        buildHeader: function (searchForm) {
            return new Header({
                title: polyglot.t('varieties-page.title'),
                icon: new Icon({name: 'dna'}),
                back: true,
                menu: app.panels.get('main-menu'),
                bottom: searchForm,
            });
        },

        buildRows: function () {
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

        buildModelRowData: function (variety) {
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

        getModelFormData: function () {
            return {
                entity_id: this.filter.entity_id,
                active: true,
            };
        },

        getModelFormVisible: function () {
            return {
                plant_id: true,
                name: true,
                active: true,
            };
        },

        setData: function () {
            this.filter = {
                entity_id: app.authentication.getEntityId(),
            };
        },
    });
});