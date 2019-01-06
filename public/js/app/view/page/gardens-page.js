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
            var searchForm = FormFactory.create('search', {modelName: 'garden'});

            Page.prototype.initialize.call(this, {
                id: 'varieties-page',
                header: HeaderFactory.create('main', {
                    title: 'Foncier',
                    icon: 'map',
                    items: {
                        searchForm: searchForm,
                    },
                }),
                body: new Body({
                    items: {
                        gardenTable: this.createGardenTable(searchForm),
                    },
                }),
            });
        },

        createGardenTable: function (searchForm) {
            return ModelTableFactory.create('garden', {
                header: false,
                filterable: true,
                filterInput: searchForm.formGroup.items.search,
                addButton: searchForm.formGroup.items.add,
                tableData: function (entity) {
                    return entity.findAll('garden');
                },
                rowTemplate: _.template($('#gardens-page-garden-table-row-template').html()),
                rowData: function (garden) {
                    var blocks = [];
                    _.each(garden.findAll('block'), function(block) {
                        blocks.push($.extend(block.toJSON(), {
                            bedCount: block.findAll('bed').length,
                        }));
                    });
                    return $.extend(garden.toJSON(), {
                        blocks: blocks,
                    });
                },
                listenToCollections: ['garden'],
                formData: function (entity) {
                    return {
                        entity_id: entity.get('id'),
                    };
                },
            });
        },

        render: function (options) {
            this.entity = options.entity;

            Page.prototype.render.call(this, options);

            this.header.items.searchForm.render();
            this.body.items.gardenTable.render({
                parentModel: this.entity,
            });
        },
    });
});