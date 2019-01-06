'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/page/page',
    'view/widget/body/body',
    'factory/header-factory',
    'view/widget/navigation/breadcrumb-navigation',
    'factory/model-table-factory',
    'export/pdf/crop-report-pdf-export',
], function ($, _, Page, Body, HeaderFactory, Breadcrumb, ModelTableFactory, CropReportPdf) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'crop-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-crop"></i> Crop',
                    items: {
                        navigation: this.createBreadcrumb(),
                    },
                }),
                body: new Body({
                    items: {
                        modelBody: new Body({
                            className: 'model-body',
                            template: _.template($('#crop-page-model-body-template').html()),
                            events: {
                                taphold: this.onHoldModelBody.bind(this),
                            },
                        }),
                        implantationTable: this.createImplantationTable(),
                        taskTable: this.createTaskTable(),
                        snapshotTable: this.createSnapshotTable(),
                    },
                }),
            });

            this.listenTo(app.collections.get('crop'), 'update', this.render);
            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createBreadcrumb: function () {
            return new Breadcrumb({
                rows: [{
                    crops: {
                        text: function(crop) { return 'Crops'; },
                        click: function(crop) { return app.router.navigate('crops'); },
                    },
                    variety: {
                        text: function(crop) { return 'Variety' },
                        click: function(crop) { return app.router.navigate('variety/' + crop.get('variety_id')); },
                    },
                    report: {
                        text: function(crop) { return '<i class="fa fa-file-pdf-o"></i>'; },
                        click: this.onClickCropReport.bind(this),
                    },
                }],
            });
        },

        createImplantationTable: function () {
            return ModelTableFactory.create('implantation', {
                title: '<i class="fa fa-map-marker"></i> Implantations',
                tableData: function (crop) {
                    return crop.findAll('implantation');
                },
                rowTemplate: _.template($('#crop-page-implantation-table-row-template').html()),
                rowData: function (implantation) {
                    var bed = implantation.find('bed');
                    var block = bed.find('block');
                    return $.extend(implantation.toJSON(), {
                        bed: bed.toJSON(),
                        block: block.toJSON(),
                    });
                },
                listenToCollections: ['implantation', 'bed', 'block'],
                redirect: function (implantation) {
                    return app.router.navigate('bed/' + implantation.find('bed').get('id'));
                },
                formData: function (crop) {
                    return {
                        garden_id: crop.get('garden_id'),
                        crop_id: crop.get('id'),
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                        crop_id: false,
                    };
                },
            });
        },

        createTaskTable: function () {
            return ModelTableFactory.create('task', {
                title: '<i class="fa fa-tasks"></i> Tasks',
                tableData: function (crop) {
                    return crop.findAll('task');
                },
                rowTemplate: _.template($('#crop-page-task-table-row-template').html()),
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
                formData: function (crop) {
                    return {
                        garden_id: crop.get('garden_id'),
                        provider_id: null,
                        crop_id: crop.get('id'),
                        pos_id: null,
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

        createSnapshotTable: function () {
            return ModelTableFactory.create('snapshot', {
                title: '<i class="fa fa-tags"></i> Snapshots',
                tableData: function (crop) {
                    return crop.findAll('snapshot');
                },
                rowTemplate: _.template($('#crop-page-snapshot-table-row-template').html()),
                rowData: function (snapshot) {
                    return $.extend(snapshot.toJSON(), {
                        category: snapshot.find('category').toJSON(),
                        photoNum: snapshot.findAll('photo').length,
                    });
                },
                listenToCollections: ['snapshot'],
                formData: function (crop) {
                    var today = new Date();
                    return {
                        garden_id: crop.get('garden_id'),
                        crop_id: crop.get('id'),
                        date: today.format('yy-mm-dd'),
                    };
                },
                formVisibility: function () {
                    return {
                        garden_id: false,
                        crop_id: false,
                        date: true,
                    };
                },
            });
        },

        render: function (options) {
            options = options || {};
            this.crop = options.crop || this.crop;

            Page.prototype.render.call(this, options);

            this.header.render();
            this.header.items.navigation.render({
                model: this.crop,
            });
            var variety = this.crop.find('variety');
            var species = variety.find('species');
            this.body.items.modelBody.render($.extend(this.crop.toJSON(), {
                variety: variety.toJSON(),
                species: species.toJSON(),
            }));
            this.body.items.implantationTable.render({
                parentModel: this.crop,
            });
            this.body.items.taskTable.render({
                parentModel: this.crop,
            });
            this.body.items.snapshotTable.render({
                parentModel: this.crop,
            });
        },

        onHoldModelBody: function () {
            app.dialogs.get('crop').show({
                title: 'Edit ' + this.crop.getDisplayName(),
                form: {
                    data: this.crop.toJSON(),
                    visibility: {
                        garden_id: false,
                        bed_id: false,
                    },
                },
            });
        },

        onClickCropReport: function () {
            app.dialogs.get('crop-report').show({
                title: 'Report ' + this.crop.getDisplayName(),
            }).done(function (formData) {
                app.loader.show();
                var pdf = new CropReportPdf({
                    crop: this.crop,
                    display: formData,
                });
                pdf.render();
                app.loader.hide();
            }.bind(this));
        },
    });
});