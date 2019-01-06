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
                id: 'garden-page',
                header: HeaderFactory.create('main', {
                    title: 'Jardin',
                    icon: 'map',
                }),
                body: new Body({
                    items: {
                        modelBody: new Body({
                            className: 'model-body',
                            template: _.template($('#garden-page-model-body-template').html()),
                            events: {
                                taphold: this.onHoldModelBody.bind(this),
                            },
                        }),
                        bedTable: this.createBlockTable(),
                    },
                }),
            });

            this.listenTo(app.collections.get('garden'), 'update', this.render);
        },

        createBlockTable: function () {
            return ModelTableFactory.create('block', {
                title: 'Bloc',
                icon: 'th',
                tableData: function (garden) {
                    return garden.findAll('block');
                },
                rowTemplate: _.template($('#garden-page-block-table-row-template').html()),
                rowData: function (block) {
                    return $.extend(block.toJSON(), {
                        bedCount: block.findAll('bed').length,
                    });
                },
                listenToCollections: ['block', 'bed'],
                formData: function (garden) {
                    return {
                        entity_id: garden.get('entity_id'),
                        garden_id: garden.get('id'),
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                    };
                },
            });
        },

        render: function (options) {
            options = options || {};
            this.garden = options.garden || this.garden;

            Page.prototype.render.call(this, options);

            this.header.render();
            this.body.items.modelBody.render(this.garden.toJSON());
            this.body.items.bedTable.render({
                parentModel: this.garden,
            });
        },

        onHoldModelBody: function () {
            app.dialogs.get('garden').show({
                title: 'Edit ' + this.garden.getDisplayName(),
                form: {
                    data: this.garden.toJSON(),
                },
            });
        },
    });
});