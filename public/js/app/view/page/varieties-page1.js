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
            var searchForm = FormFactory.create('search', {modelName: 'variety'});

            Page.prototype.initialize.call(this, {
                id: 'varieties-page',
                header: HeaderFactory.create('main', {
                    title: 'Variétés',
                    icon: 'leaf',
                    items: {
                        searchForm: searchForm,
                    },
                }),
                body: new Body({
                    items: {
                        varietyTable: this.createVarietyTable(searchForm),
                    },
                }),
            });
        },

        createVarietyTable: function (searchForm) {
            return ModelTableFactory.create('variety', {
                header: false,
                redirect: false,
                filterable: true,
                filterInput: searchForm.formGroup.items.search,
                addButton: searchForm.formGroup.items.add,
                tableData: function (entity) {
                    return entity.findAll('variety');
                },
                rowTemplate: _.template($('#varieties-page-variety-table-row-template').html()),
                rowData: function (variety) {
                    var plant = variety.find('plant'),
                        species = plant.find('species'),
                        genus = species.find('genus'),
                        family = genus.find('family');
                    return $.extend(variety.toJSON(), {
                        plant: plant.toJSON(),
                        species: species.toJSON(),
                        genus: genus.toJSON(),
                        family: family.toJSON(),
                    });
                },
                listenToCollections: ['variety'],
                formData: function (entity) {
                    return {
                        entity_id: entity.get('id'),
                        active: true,
                    };
                },
            });
        },

        render: function (options) {
            this.entity = options.entity;

            Page.prototype.render.call(this, options);

            this.header.items.searchForm.render();
            this.body.items.varietyTable.render({
                parentModel: this.entity,
            });
        },
    });
});