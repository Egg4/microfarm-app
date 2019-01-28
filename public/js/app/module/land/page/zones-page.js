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
                id: 'zones-page',
                title: polyglot.t('zones-page.title'),
                icon: new Icon({name: 'sitemap'}),
                collection: app.collections.get('zone'),
                tableOptions: {
                    models: this.buildZones.bind(this),
                    groupedModels: this.buildGroupedZones.bind(this),
                    modelRow: {
                        template: _.template($('#zones-page-zone-table-row-template').html()),
                        data: this.buildZoneRowData.bind(this),
                    },
                    modelForm: {
                        data: this.buildZoneFormData.bind(this),
                        visible: this.buildZoneFormVisible.bind(this),
                    },
                },
            });

            this.listenTo(app.collections.get('block'), 'update', this.render);
            this.listenTo(app.collections.get('bed'), 'update', this.render);
        },

        buildZones: function () {
            return this.collection.sortBy(function (zone) {
                return (zone.find('category').getDisplayName() + zone.getDisplayName()).removeDiacritics();
            });
        },

        buildGroupedZones: function (zones) {
            return _.groupBy(zones, function (zone) {
                return zone.find('category').getDisplayName();
            });
        },

        buildZoneRowData: function (zone) {
            var blocks = zone.findAll('block'),
                blocksJSON = _.map(blocks, function (block) {
                var beds = block.findAll('bed');
                return $.extend(block.toJSON(), {
                    bedCount: beds.length,
                });
            });
            return $.extend(zone.toJSON(), {
                blocks: blocksJSON,
            });
        },

        buildZoneFormData: function () {
            return {
                entity_id: app.authentication.getEntityId(),
            };
        },

        buildZoneFormVisible: function () {
            return {
                category_id: true,
                name: true,
            };
        },
    });
});