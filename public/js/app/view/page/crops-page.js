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
                collection: app.collections.get('crop'),
                separatorRowTemplate: _.template('<td colspan="1"><%- separator %></td>'),
                modelRowTemplate: _.template($('#crops-page-crop-table-row-template').html()),
            });

            this.listenTo(this.collection, 'update', this.render);
        },

        buildHeader: function (searchForm) {
            return new Header({
                title: polyglot.t('crops-page.title'),
                icon: new Icon({name: 'leaf'}),
                back: true,
                menu: app.panels.get('main-menu'),
                bottom: searchForm,
            });
        },

        buildRows: function () {
            var crops = app.collections.get('crop').sortBy(function (crop) {
                return crop.getDisplayName().removeDiacritics();
            });
            var rowGroups = _.groupBy(crops, function (crop) {
                return crop.getDisplayName().charAt(0).removeDiacritics().toUpperCase();
            });
            var rows = [];
            _.each(rowGroups, function (crops, name) {
                rows = _.union(rows, this.buildRowGroup(name, crops));
            }.bind(this));

            return rows;
        },

        buildModelRowData: function (crop) {
            var article = crop.find('article');
            return $.extend(crop.toJSON(), {
                article: article.toJSON(),
            });
        },

        navigateToModelPage: function (crop) {
            //app.router.navigate('crop/' + crop.get('id'));
        },

        getModelFormData: function () {
            return {
                entity_id: this.filter.entity_id,
            };
        },

        getModelFormVisible: function () {
            return {
                article_id: true,
                number: true,
            };
        },

        setData: function () {
            this.filter = {
                entity_id: app.authentication.getEntityId(),
            };
        },
    });
});