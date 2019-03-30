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
                        disabled: this.buildArticleFormDisabled.bind(this),
                    },
                },
            });
        },

        buildTitle: function () {
            var entityId = this.filter.entity_id,
                entity = app.collections.get('entity').get(entityId);

            if (!app.modules.has('trade')) {
                return entity.getDisplayName() + ' - ' + polyglot.t('articles-page.title');
            }

            var organizationId = this.filter.organization_id,
                organization = app.collections.get('organization').get(organizationId);
            if (!organization) {
                return entity.getDisplayName() + ' - ' + polyglot.t('articles-page.title');
            }
            else {
                return organization.getDisplayName() + ' - ' + polyglot.t('articles-page.title');
            }
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
            return {};
        },

        buildArticleFormDisabled: function () {
            return {
                organization_id: true,
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