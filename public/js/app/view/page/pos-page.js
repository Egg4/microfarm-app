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
                id: 'pos-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-truck"></i> Point of sale',
                    items: {
                        navigation: this.createBreadcrumb(),
                    },
                }),
                body: new Body({
                    items: {
                        modelBody: new Body({
                            className: 'model-body',
                            template: _.template($('#pos-page-model-body-template').html()),
                            events: {
                                taphold: this.onHoldModelBody.bind(this),
                            },
                        }),
                        taskTable: this.createTaskTable(),
                    },
                }),
            });

            this.listenTo(app.collections.get('pos'), 'update', this.render);
            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createBreadcrumb: function () {
            return new Breadcrumb({
                rows: [{
                    poss: {
                        text: function(pos) { return 'Points of sale'; },
                        click: function(pos) { return app.router.navigate('poss'); },
                    },
                }],
            });
        },

        createTaskTable: function () {
            return ModelTableFactory.create('task', {
                title: '<i class="fa fa-tasks"></i> Tasks',
                tableData: function (pos) {
                    return pos.findAll('task');
                },
                rowTemplate: _.template($('#pos-page-task-table-row-template').html()),
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
                formData: function (pos) {
                    return {
                        garden_id: pos.get('garden_id'),
                        provider_id: null,
                        crop_id: null,
                        pos_id: pos.get('id'),
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
            this.pos = options.pos || this.pos;

            Page.prototype.render.call(this, options);

            this.header.render();
            this.header.items.navigation.render({
                model: this.pos,
            });
            this.body.items.modelBody.render(this.pos.toJSON());
            this.body.items.taskTable.render({
                parentModel: this.pos,
            });
        },

        onHoldModelBody: function () {
            app.dialogs.get('pos').show({
                title: 'Edit ' + this.pos.getDisplayName(),
                form: {
                    data: this.pos.toJSON(),
                    visibility: {
                        garden_id: false,
                    },
                },
            });
        },
    });
});