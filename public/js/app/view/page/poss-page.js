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
            var searchForm = FormFactory.create('search', {modelName: 'pos'});

            Page.prototype.initialize.call(this, {
                id: 'poss-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-truck"></i> Points of sale',
                    items: {
                        searchForm: searchForm,
                    },
                }),
                body: new Body({
                    items: {
                        posTable: this.createPosTable(searchForm),
                    },
                }),
            });

            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createPosTable: function (searchForm) {
            return ModelTableFactory.create('pos', {
                header: false,
                filterable: true,
                filterInput: searchForm.formGroup.items.search,
                addButton: searchForm.formGroup.items.add,
                tableData: function (garden) {
                    return garden.findAll('pos');
                },
                rowTemplate: _.template($('#poss-page-pos-table-row-template').html()),
                rowData: function (pos) {
                    return $.extend(pos.toJSON(), {
                        taskNum: pos.findAll('task').length,
                    });
                },
                listenToCollections: ['pos'],
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
            this.body.items.posTable.render({
                parentModel: this.garden,
            });
        },
    });
});