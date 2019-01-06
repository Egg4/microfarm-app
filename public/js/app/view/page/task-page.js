'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/page/page',
    'view/widget/body/body',
    'factory/header-factory',
    'view/widget/navigation/breadcrumb-navigation',
    'factory/model-table-factory',
    'export/pdf/task-report-pdf-export',
], function ($, _, Page, Body, HeaderFactory, Breadcrumb, ModelTableFactory, TaskReportPdf) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'task-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-tasks"></i> Task',
                    items: {
                        providerNavigation: this.createProviderBreadcrumb(),
                        cropNavigation: this.createCropBreadcrumb(),
                        posNavigation: this.createPosBreadcrumb(),
                    },
                }),
                body: new Body({
                    items: {
                        modelBody: new Body({
                            className: 'model-body',
                            template: _.template($('#task-page-model-body-template').html()),
                            events: {
                                taphold: this.onHoldModelBody.bind(this),
                            },
                        }),
                        workTable: this.createWorkTable(),
                        inputTable: this.createInputTable(),
                        outputTable: this.createOutputTable(),
                        photoTable: this.createPhotoTable(),
                    },
                }),
            });

            this.listenTo(app.collections.get('task'), 'update', this.render);
            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createProviderBreadcrumb: function () {
            return new Breadcrumb({
                rows: [{
                    providers: {
                        text: function(task) { return 'Providers'; },
                        click: function(task) { return app.router.navigate('providers'); },
                    },
                    provider: {
                        text: function(task) { return task.find('provider').getDisplayName(); },
                        click: function(task) { return app.router.navigate('provider/' + task.get('provider_id')); },
                    },
                    report: {
                        text: function(task) { return '<i class="fa fa-file-pdf-o"></i>'; },
                        click: this.onClickTaskReport.bind(this),
                    },
                }],
            });
        },

        createCropBreadcrumb: function () {
            return new Breadcrumb({
                rows: [{
                    blocks: {
                        text: function(task) { return 'Blocks'; },
                        click: function(task) { return app.router.navigate('blocks'); },
                    },
                    crop: {
                        text: function(task) { return 'Crop' },
                        click: function(task) { return app.router.navigate('crop/' + task.get('crop_id')); },
                    },
                }],
            });
        },

        createPosBreadcrumb: function () {
            return new Breadcrumb({
                rows: [{
                    poss: {
                        text: function(task) { return 'Points of sale'; },
                        click: function(task) { return app.router.navigate('poss'); },
                    },
                    pos: {
                        text: function(task) { return task.find('pos').getDisplayName(); },
                        click: function(task) { return app.router.navigate('pos/' + task.get('pos_id')); },
                    },
                    report: {
                        text: function(task) { return '<i class="fa fa-file-pdf-o"></i>'; },
                        click: this.onClickTaskReport.bind(this),
                    },
                }],
            });
        },

        createWorkTable: function () {
            return ModelTableFactory.create('work', {
                title: '<i class="fa fa-wrench"></i> Works',
                redirect: false,
                tableData: function (task) {
                    return task.findAll('work');
                },
                rowTemplate: _.template($('#task-page-work-table-row-template').html()),
                rowData: function (work) {
                    return $.extend(work.toJSON(), {
                        duration : work.toFixed('duration', 1),
                    });
                },
                listenToCollections: ['work', 'task'],
                formData: function (task) {
                    return {
                        garden_id: task.get('garden_id'),
                        task_id: task.get('id'),
                        date: task.get('planned_date'),
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                        task_id: false,
                    };
                },
            });
        },

        createInputTable: function () {
            return ModelTableFactory.create('flow', {
                title: '<i class="fa fa-sign-in"></i> Inputs',
                tableData: function (task) {
                    return task.findAll('flow', {filter: {type: 'input'}});
                },
                rowTemplate: _.template($('#task-page-input-table-row-template').html()),
                rowData: function (flow) {
                    return $.extend(flow.toJSON(), {
                        product: flow.find('product').toJSON(),
                        category: flow.find('product').find('category').toJSON(),
                        flow: flow.find('flow').toJSON(),
                    });
                },
                listenToCollections: ['flow', 'product', 'task'],
                formData: function (task) {
                    return {
                        garden_id: task.get('garden_id'),
                        task_id: task.get('id'),
                        type: 'input',
                        lot: '',
                        date: task.get('planned_date'),
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                        task_id: false,
                        type: false,
                        lot: false,
                        date: true,
                    };
                },
            });
        },

        createOutputTable: function () {
            return ModelTableFactory.create('flow', {
                title: '<i class="fa fa-sign-out"></i> Outputs',
                tableData: function (task) {
                    return task.findAll('flow', {filter: {type: 'output'}});
                },
                rowTemplate: _.template($('#task-page-output-table-row-template').html()),
                rowData: function (flow) {
                    return $.extend(flow.toJSON(), {
                        product: flow.find('product').toJSON(),
                        category: flow.find('product').find('category').toJSON(),
                    });
                },
                listenToCollections: ['flow', 'product', 'task'],
                formData: function (task) {
                    return {
                        garden_id: task.get('garden_id'),
                        task_id: task.get('id'),
                        flow_id: null,
                        type: 'output',
                        date: task.get('planned_date'),
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                        task_id: false,
                        flow_id: false,
                        type: false,
                        date: true,
                    };
                },
            });
        },

        createPhotoTable: function () {
            return ModelTableFactory.create('photo', {
                title: '<i class="fa fa-camera-retro"></i> Photos',
                redirect: false,
                tableData: function (task) {
                    return task.findAll('photo');
                },
                rowTemplate: _.template($('#task-page-photo-table-row-template').html()),
                rowData: function (photo) {
                    return $.extend(photo.toJSON(), {

                    });
                },
                listenToCollections: ['photo', 'task'],
                formData: function (task) {
                    var today = new Date();
                    return {
                        garden_id: task.get('garden_id'),
                        task_id: task.get('id'),
                        snapshot_id: null,
                        date: today.format('yy-mm-dd'),
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                        task_id: false,
                        snapshot_id: false,
                        date: true,
                    };
                },
            });
        },

        render: function (options) {
            options = options || {};
            this.task = options.task || this.task;

            var category = this.task.find('category');
            var provider = this.task.find('provider');
            var crop = this.task.find('crop');
            if (crop) {
                var variety = crop.find('variety');
                var species = variety.find('species');
            }
            var pos = this.task.find('pos');

            Page.prototype.render.call(this, options);

            this.header.render();
            _.each(this.header.items, function (navigation) {
                navigation.$el.hide(0);
            }.bind(this));
            if (provider) {
                this.header.items.providerNavigation.render({
                    model: this.task,
                });
                this.header.items.providerNavigation.$el.show(0);
            }
            if (crop) {
                this.header.items.cropNavigation.render({
                    model: this.task,
                });
                this.header.items.cropNavigation.$el.show(0);
            }
            if (pos) {
                this.header.items.posNavigation.render({
                    model: this.task,
                });
                this.header.items.posNavigation.$el.show(0);
            }
            this.body.items.modelBody.render($.extend(this.task.toJSON(), {
                category: category.toJSON(),
                provider: provider ? provider.toJSON() : null,
                crop: crop ? crop.toJSON() : null,
                variety: crop ? variety.toJSON() : null,
                species: crop ? species.toJSON() : null,
                pos: pos ? pos.toJSON() : null,
            }));
            this.body.items.workTable.render({
                parentModel: this.task,
            });
            this.body.items.inputTable.render({
                parentModel: this.task,
            });
            this.body.items.outputTable.render({
                parentModel: this.task,
            });
            this.body.items.photoTable.render({
                parentModel: this.task,
            });
        },

        onHoldModelBody: function () {
            app.dialogs.get('task').show({
                title: 'Edit ' + this.task.getDisplayName(),
                form: {
                    data: this.task.toJSON(),
                    visibility: {
                        garden_id: false,
                        provider_id: false,
                        crop_id: false,
                        pos_id: false,
                    },
                },
            });
        },

        onClickTaskReport: function () {
            app.dialogs.get('task-report').show({
                title: 'Report ' + this.task.getDisplayName(),
            }).done(function (formData) {
                app.loader.show();
                var pdf = new TaskReportPdf({
                    task: this.task,
                    display: formData,
                });
                pdf.render();
                app.loader.hide();
            }.bind(this));
        },
    });
});