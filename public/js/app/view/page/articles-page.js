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
                collection: app.collections.get('article'),
                separatorRowTemplate: _.template('<td colspan="3"><%- separator %></td>'),
                modelRowTemplate: _.template($('#articles-page-article-table-row-template').html()),
            });

            this.listenTo(this.collection, 'update', this.render);
        },

        buildHeader: function (searchForm) {
            return new Header({
                title: function () {
                    var name = '';
                    if (_.isNull(this.filter.organization_id)) {
                        name = app.collections.get('entity').get(app.authentication.getEntityId()).getDisplayName();
                    } else {
                        name = app.collections.get('organization').get(this.filter.organization_id).getDisplayName();
                    }
                    return polyglot.t('articles-page.title') + ' - ' + name;
                }.bind(this),
                icon: new Icon({name: 'shopping-cart'}),
                back: true,
                menu: app.panels.get('main-menu'),
                bottom: searchForm,
            });
        },

        buildRows: function () {
            var articles = app.collections.get('article').where(this.filter);
            articles = _.sortBy(articles, function (article) {
                return (article.find('category').getDisplayName() + article.getDisplayName()).removeDiacritics();
            });
            var rowGroups = _.groupBy(articles, function (article) {
                return article.find('category').getDisplayName();
            });
            var rows = [];
            _.each(rowGroups, function (articles, name) {
                rows = _.union(rows, this.buildRowGroup(name, articles));
            }.bind(this));

            return rows;
        },

        buildModelRowData: function (article) {
            var quantityUnitCategory = article.find('category', {
                selfAttribute: 'quantity_unit_id',
            });
            return $.extend(article.toJSON(), {
                quantityUnitCategory: quantityUnitCategory.toJSON(),
            });
        },

        navigateToModelPage: function (article) {
            //app.router.navigate('article/' + article.get('id'));
        },

        getModelFormData: function () {
            return {
                entity_id: this.filter.entity_id,
                organization_id: this.filter.organization_id,
                active: true,
            };
        },

        getModelFormVisible: function () {
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
                entity_id: app.authentication.getEntityId(),
                organization_id: !_.isNull(organization_id) ? parseInt(organization_id) : null,
            };
        },
    });
});