'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/page/page',
    'view/widget/body/body',
    'factory/header-factory',
    'factory/form-factory',
    'factory/model-table-factory',
], function ($, _, Page, Body, HeaderFactory, FormFactory, ModelTableFactory) {

    return Page.extend({

        initialize: function () {
            var searchForm = FormFactory.create('search', {modelName: 'article'});

            Page.prototype.initialize.call(this, {
                id: 'articles-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-pagelines"></i> Articles',
                    items: {
                        searchForm: searchForm,
                    },
                }),
                body: new Body({
                    items: {
                        articleTable: this.createArticleTable(searchForm),
                    },
                }),
            });
        },

        createArticleTable: function (searchForm) {
            return ModelTableFactory.create('article', {
                header: false,
                filterable: true,
                filterInput: searchForm.formGroup.items.search,
                addButton: searchForm.formGroup.items.add,
                tableData: function (organization) {
                    return app.collections.get('article').where({
                        organization_id: !_.isNull(organization) ? organization.get('id') : null,
                    });
                },
                rowTemplate: _.template($('#articles-page-article-table-row-template').html()),
                rowData: function (article) {
                    return $.extend(article.toJSON(), {

                    });
                },
                listenToCollections: ['article'],
                formData: function (organization) {
                    return {
                        entity_id: app.collections.get('entity').at(0).get('id'),
                        organization_id: !_.isNull(organization) ? organization.get('id') : null,
                        active: true,
                    };
                },
            });
        },

        render: function (options) {
            Page.prototype.render.call(this, options);

            this.header.items.searchForm.render();
            this.body.items.articleTable.render({
                parentModel: options.organization,
            });
        },
    });
});