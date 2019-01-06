'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/page/page',
    'view/widget/body/body',
    'factory/header-factory',
    'view/widget/navigation/breadcrumb-navigation',
    'factory/model-table-factory',
    'view/widget/navigation/navigation',
], function ($, _, Page, Body, HeaderFactory, Breadcrumb, ModelTableFactory, Navigation) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'snapshot-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-tags"></i> Snapshot',
                    items: {
                        navigation: this.createBreadcrumb(),
                    },
                }),
                body: new Body({
                    items: {
                        modelBody: new Body({
                            className: 'model-body',
                            template: _.template($('#snapshot-page-model-body-template').html()),
                            events: {
                                taphold: this.onHoldModelBody.bind(this),
                            },
                        }),
                        photoTable: this.createPhotoTable(),
                    },
                }),
            });

            this.listenTo(app.collections.get('snapshot'), 'update', this.render);
            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createBreadcrumb: function () {
            return new Breadcrumb({
                rows: [{
                    blocks: {
                        text: function(snapshot) { return 'Blocks'; },
                        click: function(snapshot) { return app.router.navigate('blocks'); },
                    },
                    crop: {
                        text: function(snapshot) { return 'Crop'; },
                        click: function(snapshot) { return app.router.navigate('crop/' + snapshot.get('crop_id')); },
                    },
                }],
            });
        },

        createPhotoTable: function () {
            return ModelTableFactory.create('photo', {
                title: '<i class="fa fa-camera-retro"></i> Photos',
                redirect: false,
                tableData: function (snapshot) {
                    return snapshot.findAll('photo');
                },
                rowTemplate: _.template($('#snapshot-page-photo-table-row-template').html()),
                rowData: function (photo) {
                    return $.extend(photo.toJSON(), {

                    });
                },
                listenToCollections: ['photo', 'snapshot'],
                formData: function (snapshot) {
                    var today = new Date();
                    return {
                        garden_id: snapshot.get('garden_id'),
                        task_id: null,
                        snapshot_id: snapshot.get('id'),
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
            this.snapshot = options.snapshot || this.snapshot;

            Page.prototype.render.call(this, options);

            this.header.render();
            this.header.items.navigation.render({
                model: this.snapshot,
            });
            this.body.items.modelBody.render($.extend(this.snapshot.toJSON(), {
                category: this.snapshot.find('category').toJSON(),
            }));
            this.body.items.photoTable.render({
                parentModel: this.snapshot,
            });
        },

        onHoldModelBody: function () {
            app.dialogs.get('snapshot').show({
                title: 'Edit ' + this.snapshot.getDisplayName(),
                form: {
                    data: this.snapshot.toJSON(),
                    visibility: {
                        garden_id: false,
                        crop_id: false,
                    },
                },
            });
        },
    });
});