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
                id: 'articles-page',
                title: this.buildTitle.bind(this),
                icon: new Icon({name: 'shopping-cart'}),
                collection: app.collections.get('article'),
                tableOptions: {
                    models: this.buildArticles.bind(this),
                    groupedModels: this.buildGroupedArticles.bind(this),
                    modelRow: {
                        options: this.buildArticleRowOptions.bind(this),
                        template: _.template($('#articles-page-article-table-row-template').html()),
                        data: this.buildArticleRowData.bind(this),
                    },
                    modelForm: {
                        data: this.buildArticleFormData.bind(this),
                        visible: this.buildArticleFormVisible.bind(this),
                    },
                },
            });
        },

        buildTitle: function () {
            var name = '';
            if (_.isNull(this.filter.organization_id)) {
                name = app.collections.get('entity').get(this.filter.entity_id).getDisplayName();
            } else {
                name = app.collections.get('organization').get(this.filter.organization_id).getDisplayName();
            }
            return polyglot.t('articles-page.title') + ' - ' + name;
        },

        buildArticles: function () {
            var articles = this.collection.where(this.filter);

            return _.sortBy(articles, function (article) {
                return (article.find('category').getDisplayName() + article.getDisplayName()).removeDiacritics();
            });
        },

        buildGroupedArticles: function (articles) {
            return _.groupBy(articles, function (article) {
                return article.find('category').getDisplayName();
            });
        },

        buildArticleRowOptions: function (article) {
            return {
                className: article.get('active') ? '' : 'disabled',
            };
        },

        buildArticleRowData: function (article) {
            var quantityUnitCategory = article.find('category', {
                selfAttribute: 'quantity_unit_id',
            });
            return $.extend(article.toJSON(), {
                quantityUnitCategory: quantityUnitCategory.toJSON(),
            });
        },

        buildArticleFormData: function () {
            return {
                entity_id: this.filter.entity_id,
                organization_id: this.filter.organization_id,
                active: true,
            };
        },

        buildArticleFormVisible: function () {
            return {
                organization_id: false,
                category_id: true,
                name: true,
                quantity_unit_id: true,
                default_unit_price: true,
                default_tax: true,
                active: true,
            };
        },

        setData: function (organization_id) {
            this.filter = {
                entity_id: app.authentication.get('entity_id'),
                organization_id: !_.isNull(organization_id) ? parseInt(organization_id) : null,
            };
        },
    });
});