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
                id: 'crops-page',
                title: polyglot.t('crops-page.title'),
                icon: new Icon({name: 'leaf'}),
                collection: app.collections.get('crop'),
                tableOptions: {
                    models: this.buildCrops.bind(this),
                    groupedModels: this.buildGroupedCrops.bind(this),
                    modelRow: {
                        template: _.template($('#crops-page-crop-table-row-template').html()),
                        data: this.buildCropRowData.bind(this),
                    },
                    modelForm: {
                        data: this.buildCropFormData.bind(this),
                        visible: this.buildCropFormVisible.bind(this),
                    },
                },
            });
        },

        buildCrops: function () {
            return this.collection.sortBy(function (crop) {
                return crop.getDisplayName().removeDiacritics();
            });
        },

        buildGroupedCrops: function (crops) {
            return _.groupBy(crops, function (crop) {
                return crop.getDisplayName().charAt(0).removeDiacritics().toUpperCase();
            });
        },

        buildCropRowData: function (crop) {
            var article = crop.find('article');
            return $.extend(crop.toJSON(), {
                article: article.toJSON(),
            });
        },

        buildCropFormData: function () {
            return {
                entity_id: app.authentication.get('entity_id'),
            };
        },

        buildCropFormVisible: function () {
            return {
                article_id: true,
                number: true,
            };
        },
    });
});