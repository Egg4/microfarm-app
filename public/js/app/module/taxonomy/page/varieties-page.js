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
                title: polyglot.t('varieties-page.title'),
                icon: new Icon({name: 'dna'}),
                collection: app.collections.get('variety'),
                tableOptions: {
                    models: this.buildVarieties.bind(this),
                    groupedModels: this.buildGroupedVarieties.bind(this),
                    modelRow: {
                        options: this.buildVarietyRowOptions.bind(this),
                        template: _.template($('#varieties-page-variety-table-row-template').html()),
                        data: this.buildVarietyRowData.bind(this),
                        events: {
                            click: false,
                        },
                    },
                    modelForm: {
                        data: this.buildVarietyFormData.bind(this),
                        visible: this.buildVarietyFormVisible.bind(this),
                    },
                },
            });
        },

        buildVarieties: function () {
            return this.collection.sortBy(function (variety) {
                return variety.getDisplayName().removeDiacritics();
            });
        },

        buildGroupedVarieties: function (varieties) {
            return _.groupBy(varieties, function (variety) {
                return variety.getDisplayName().charAt(0).removeDiacritics().toUpperCase();
            });
        },

        buildVarietyRowOptions: function (variety) {
            return {
                className: variety.get('active') ? '' : 'disabled',
            };
        },

        buildVarietyRowData: function (variety) {
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

        buildVarietyFormData: function () {
            return {
                entity_id: app.authentication.getEntityId(),
                active: true,
            };
        },

        buildVarietyFormVisible: function () {
            return {
                plant_id: true,
                name: true,
                active: true,
            };
        },
    });
});