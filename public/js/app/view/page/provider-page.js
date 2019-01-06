'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/page/page',
    'view/widget/body/body',
    'factory/header-factory',
    'view/widget/navigation/breadcrumb-navigation',
    'factory/model-table-factory',
], function ($, _, Page, Body, HeaderFactory, Breadcrumb, ModelTableFactory) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'provider-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-copyright"></i> Provider',
                    items: {
                        navigation: this.createBreadcrumb(),
                    },
                }),
                body: new Body({
                    items: {
                        modelBody: new Body({
                            className: 'model-body',
                            template: _.template($('#provider-page-model-body-template').html()),
                            events: {
                                taphold: this.onHoldModelBody.bind(this),
                            },
                        }),
                        productTable: this.createProductTable(),
                        taskTable: this.createTaskTable(),
                    },
                }),
            });

            this.listenTo(app.collections.get('provider'), 'update', this.render);
            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createBreadcrumb: function () {
            return new Breadcrumb({
                rows: [{
                    providers: {
                        text: function(provider) { return 'Providers'; },
                        click: function(provider) { return app.router.navigate('providers'); },
                    },
                }],
            });
        },

        createProductTable: function () {
            return ModelTableFactory.create('product', {
                title: '<i class="fa fa-database"></i> Products',
                tableData: function (provider) {
                    return provider.findAll('product');
                },
                rowTemplate: _.template($('#provider-page-product-table-row-template').html()),
                rowData: function (product) {
                    return $.extend(product.toJSON(), {
                        category: product.find('category').toJSON(),
                        inputNum: product.findAll('flow', {filter: {type: 'input'}}).length,
                        outputNum: product.findAll('flow', {filter: {type: 'output'}}).length,
                    });
                },
                listenToCollections: ['product'],
                formData: function (provider) {
                    return {
                        garden_id: provider.get('garden_id'),
                        provider_id: provider.get('id'),
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                        provider_id: false,
                    };
                },
            });
        },

        createTaskTable: function () {
            return ModelTableFactory.create('task', {
                title: '<i class="fa fa-tasks"></i> Tasks',
                tableData: function (provider) {
                    return provider.findAll('task');
                },
                rowTemplate: _.template($('#provider-page-task-table-row-template').html()),
                rowData: function (task) {
                    var duration = 0.0;
                    _.each(task.findAll('work'), function (work) {
                        duration += parseFloat(work.get('duration'));
                    });
                    return $.extend(task.toJSON(), {
                        duration : duration.toFixed(1),
                        category: task.find('category').toJSON(),
                        inputNum: task.findAll('flow', {filter: {type: 'input'}}).length,
                        outputNum: task.findAll('flow', {filter: {type: 'output'}}).length,
                        photoNum: task.findAll('photo').length,
                    });
                },
                listenToCollections: ['task', 'work', 'flow'],
                formData: function (provider) {
                    return {
                        garden_id: provider.get('garden_id'),
                        provider_id: provider.get('id'),
                        crop_id: null,
                        pos_id: null,
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                        provider_id: false,
                        crop_id: false,
                        pos_id: false,
                    };
                },
            });
        },

        render: function (options) {
            options = options || {};
            this.provider = options.provider || this.provider;

            Page.prototype.render.call(this, options);

            this.header.render();
            this.header.items.navigation.render({
                model: this.provider,
            });
            this.body.items.modelBody.render(this.provider.toJSON());
            this.body.items.productTable.render({
                parentModel: this.provider,
            });
            this.body.items.taskTable.render({
                parentModel: this.provider,
            });
        },

        onHoldModelBody: function () {
            app.dialogs.get('provider').show({
                title: 'Edit ' + this.provider.getDisplayName(),
                form: {
                    data: this.provider.toJSON(),
                    visibility: {
                        garden_id: false,
                    },
                },
            });
        },
    });
});