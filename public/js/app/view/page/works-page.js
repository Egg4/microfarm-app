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
            var searchForm = FormFactory.create('search', {modelName: 'work'});

            Page.prototype.initialize.call(this, {
                id: 'works-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-wrench"></i> Works',
                    items: {
                        searchForm: searchForm,
                    },
                }),
                body: new Body({
                    items: {
                        workTable: this.createWorkTable(searchForm),
                    },
                }),
            });

            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createWorkTable: function (searchForm) {
            return ModelTableFactory.create('work', {
                header: false,
                filterable: true,
                filterInput: searchForm.formGroup.items.search,
                addButton: searchForm.formGroup.items.add,
                redirect: false,
                tableData: function (garden) {
                    return garden.findAll('work');
                },
                rowTemplate: _.template($('#works-page-work-table-row-template').html()),
                rowData: function (work) {
                    return $.extend(work.toJSON(), {
                        task: work.find('task').toJSON(),
                        category: work.find('task').find('category').toJSON(),
                    });
                },
                listenToCollections: ['work', 'task'],
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
            this.body.items.workTable.render({
                parentModel: this.garden,
            });
        },
    });
});