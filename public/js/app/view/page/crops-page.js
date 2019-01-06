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
            var searchForm = FormFactory.create('search', {modelName: 'crop'});

            Page.prototype.initialize.call(this, {
                id: 'crops-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-crop"></i> Crops',
                    items: {
                        searchForm: searchForm,
                    },
                }),
                body: new Body({
                    items: {
                        cropTable: this.createCropTable(searchForm),
                    },
                }),
            });

            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createCropTable: function (searchForm) {
            return ModelTableFactory.create('crop', {
                header: false,
                filterable: true,
                filterInput: searchForm.formGroup.items.search,
                addButton: searchForm.formGroup.items.add,
                tableData: function (garden) {
                    return garden.findAll('crop');
                },
                rowTemplate: _.template($('#crops-page-crop-table-row-template').html()),
                rowData: function (crop) {
                    var implantations = [];
                    _.each(crop.findAll('implantation'), function (implantation) {
                        var bed = implantation.find('bed');
                        implantations.push($.extend(implantation.toJSON(), {
                            bed: bed.toJSON(),
                            block: bed.find('block').toJSON(),
                        }));
                    });
                    return $.extend(crop.toJSON(), {
                        variety: crop.find('variety').toJSON(),
                        species: crop.find('variety').find('species').toJSON(),
                        implantations: implantations,
                        implantationNum: implantations.length,
                        taskNum: crop.findAll('task').length,
                        snapshotNum: crop.findAll('snapshot').length,
                    });
                },
                listenToCollections: ['crop', 'variety', 'bed', 'block', 'task', 'snapshot'],
                formData: function (garden) {
                    return {
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
            this.garden = options.garden;

            Page.prototype.render.call(this, options);

            this.header.items.searchForm.render();
            this.body.items.cropTable.render({
                parentModel: this.garden,
            });
        },
    });
});
