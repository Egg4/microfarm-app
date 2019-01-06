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
            var searchForm = FormFactory.create('search', {modelName: 'task'});

            Page.prototype.initialize.call(this, {
                id: 'tasks-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-tasks"></i> Tasks',
                    items: {
                        searchForm: searchForm,
                    },
                }),
                body: new Body({
                    items: {
                        taskTable: this.createTaskTable(searchForm),
                    },
                }),
            });

            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createTaskTable: function (searchForm) {
            return ModelTableFactory.create('task', {
                header: false,
                filterable: true,
                filterInput: searchForm.formGroup.items.search,
                addButton: searchForm.formGroup.items.add,
                tableData: function (garden) {
                    return garden.findAll('task');
                },
                rowTemplate: _.template($('#tasks-page-task-table-row-template').html()),
                rowData: function (task) {
                    var category = task.find('category');
                    var provider = task.find('provider');
                    var crop = task.find('crop');
                    var pos = task.find('pos');
                    return $.extend(task.toJSON(), {
                        category: category.toJSON(),
                        provider: provider ? provider.toJSON() : null,
                        crop: crop ? crop.toJSON() : null,
                        variety: crop ? crop.find('variety').toJSON() : null,
                        pos: pos ? pos.toJSON() : null,
                    });
                },
                listenToCollections: ['task', 'crop'],
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
            this.body.items.taskTable.render({
                parentModel: this.garden,
            });
        },
    });
});