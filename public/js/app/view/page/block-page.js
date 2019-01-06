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
                id: 'block-page',
                header: HeaderFactory.create('main', {
                    title: 'Bloc',
                    icon: 'th',
                }),
                body: new Body({
                    items: {
                        modelBody: new Body({
                            className: 'model-body',
                            template: _.template($('#block-page-model-body-template').html()),
                            events: {
                                taphold: this.onHoldModelBody.bind(this),
                            },
                        }),
                        bedTable: this.createBedTable(),
                    },
                }),
            });

            this.listenTo(app.collections.get('block'), 'update', this.render);
        },

        createBedTable: function () {
            return ModelTableFactory.create('bed', {
                redirect: false,
                title: 'Planches',
                icon: 'align-justify',
                tableData: function (block) {
                    return block.findAll('bed');
                },
                rowTemplate: _.template($('#block-page-bed-table-row-template').html()),
                rowData: function (bed) {
                    return $.extend(bed.toJSON(), {

                    });
                },
                listenToCollections: ['bed'],
                formData: function (block) {
                    return {
                        entity_id: block.get('entity_id'),
                        block_id: block.get('id'),
                    };
                },
                formVisibility: function () {
                    return {
                        entity_id: false,
                        block_id: false,
                    };
                },
            });
        },

        render: function (options) {
            options = options || {};
            this.block = options.block || this.block;

            Page.prototype.render.call(this, options);

            this.header.render();
            this.body.items.modelBody.render($.extend(this.block.toJSON(), {
                garden: this.block.find('garden').toJSON(),
            }));
            this.body.items.bedTable.render({
                parentModel: this.block,
            });
        },

        onHoldModelBody: function () {
            app.dialogs.get('block').show({
                title: 'Edit ' + this.block.getDisplayName(),
                form: {
                    data: this.block.toJSON(),
                    visibility: {
                        garden_id: false,
                    },
                },
            });
        },
    });
});