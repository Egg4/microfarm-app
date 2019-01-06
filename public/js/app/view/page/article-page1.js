'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/page/page',
    'view/widget/body/body',
    'factory/header-factory',
    'factory/model-table-factory',
], function ($, _, Page, Body, HeaderFactory, ModelTableFactory) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'article-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-th-large"></i> Article',
                }),
                body: new Body({
                    items: {
                        modelBody: new Body({
                            className: 'model-body',
                            template: _.template($('#article-page-model-body-template').html()),
                            events: {
                                taphold: this.onHoldModelBody.bind(this),
                            },
                        }),
                        categoryTable: this.createCategoryTable(),
                        plantTable: this.createPlantTable(),
                    },
                }),
            });

            this.listenTo(app.collections.get('article'), 'update', this.render);
        },

        createCategoryTable: function () {
            return ModelTableFactory.create('article_category', {
                redirect: false,
                title: '<i class="fa fa-bars"></i> Usages',
                tableData: function (article) {
                    return article.findAll('article_category');
                },
                rowTemplate: _.template($('#article-page-article_category-table-row-template').html()),
                rowData: function (article_category) {
                    return $.extend(article_category.toJSON(), {
                        category: article_category.find('category').toJSON(),
                    });
                },
                listenToCollections: ['article_category'],
                formData: function (article) {
                    return {
                        entity_id: article.get('entity_id'),
                        article_id: article.get('id'),
                    };
                }.bind(this),
                formVisibility: function () {
                    return {
                        entity_id: false,
                        article_id: false,
                    };
                },
            });
        },

        createPlantTable: function () {
            return ModelTableFactory.create('article_plant', {
                redirect: false,
                title: '<i class="fa fa-bars"></i> Plantes',
                tableData: function (article) {
                    return article.findAll('article_plant');
                },
                rowTemplate: _.template($('#article-page-article_plant-table-row-template').html()),
                rowData: function (article_plant) {
                    return $.extend(article_plant.toJSON(), {
                        plant: article_plant.find('plant').toJSON(),
                    });
                },
                listenToCollections: ['article_plant'],
                formData: function (article) {
                    return {
                        entity_id: article.get('entity_id'),
                        article_id: article.get('id'),
                    };
                }.bind(this),
                formVisibility: function () {
                    return {
                        entity_id: false,
                        article_id: false,
                    };
                },
            });
        },

        render: function (options) {
            options = options || {};
            this.article = options.article || this.article;

            Page.prototype.render.call(this, options);

            this.header.render();
            this.body.items.modelBody.render($.extend(this.article.toJSON(), {

            }));
            this.body.items.categoryTable.render({
                parentModel: this.article,
            });
            this.body.items.plantTable.render({
                parentModel: this.article,
            });
        },

        onHoldModelBody: function () {
            app.dialogs.get('article').show({
                title: 'Edit ' + this.article.getDisplayName(),
                form: {
                    data: this.article.toJSON(),
                    visibility: {
                        entity_id: false,
                    },
                },
            });
        },
    });
});