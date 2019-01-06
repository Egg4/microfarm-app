'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/page/page',
    'view/widget/body/body',
    'factory/header-factory',
    'view/widget/navigation/breadcrumb-navigation',
    'view/widget/bar/header-bar',
    'view/widget/table/table',
    'view/widget/table/row/table-row',
    'export/pdf/seed-pocket-pdf-export',
], function ($, _, Page, Body, HeaderFactory, Breadcrumb, Header, Table, TableRow, SeedPocketPdf) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'flow-page',
                header: HeaderFactory.create('main', {
                    title: '<i class="fa fa-exchange"></i> Flow',
                    items: {
                        navigation: this.createBreadcrumb(),
                        seedNavigation: this.createSeedBreadcrumb(),
                    },
                }),
                body: new Body({
                    items: {
                        destinationFlowTable: this.createDestinationFlowTable(),
                        currentFlowTable: this.createCurrentFlowTable(),
                        originFlowTable: this.createOriginFlowTable(),
                    },
                }),
            });

            this.listenTo(app.collections.get('flow'), 'update', this.render);
            $(this.el).on('swipeleft', function () {
                app.panels.get('menu').show();
            });
        },

        createBreadcrumb: function () {
            return new Breadcrumb({
                rows: [{
                    product: {
                        text: function(flow) { return 'Product'; },
                        click: function(flow) { return app.router.navigate('product/' + flow.get('product_id')); },
                    },
                    task: {
                        text: function(flow) { return 'Task'; },
                        click: function(flow) { return app.router.navigate('task/' + flow.get('task_id')); },
                    },
                }],
            });
        },

        createSeedBreadcrumb: function () {
            return new Breadcrumb({
                rows: [{
                    product: {
                        text: function(flow) { return 'Product'; },
                        click: function(flow) { return app.router.navigate('product/' + flow.get('product_id')); },
                    },
                    task: {
                        text: function(flow) { return 'Task'; },
                        click: function(flow) { return app.router.navigate('task/' + flow.get('task_id')); },
                    },
                    pocket: {
                        text: function(flow) { return '<i class="fa fa-envelope-o"></i>'; },
                        click: this.onClickSeedPocket.bind(this),
                    },
                }],
            });
        },

        createDestinationFlowTable: function () {
            return new Table({
                header: new Header({
                    title: '<i class="fa fa-exchange"></i> Destination',
                }),
                data: this.destinationFlowTableData.bind(this),
                bodyRow: TableRow.extend({
                    template: _.template($('#flow-page-flow-table-row-template').html()),
                    data: this.flowTableRowData.bind(this),
                    events: {
                        click: function () {
                            if (app.authentication.hasRights('flow', 'view')) {
                                app.router.navigate('flow/' + this.row.get('id'));
                            }
                        },
                    },
                }),
            });
        },

        createCurrentFlowTable: function () {
            return new Table({
                header: new Header({
                    title: '<i class="fa fa-exchange"></i> Current',
                }),
                data: function (flow) {
                    return [flow];
                },
                bodyRow: TableRow.extend({
                    template: _.template($('#flow-page-flow-table-row-template').html()),
                    data: this.flowTableRowData.bind(this),
                    events: {
                        taphold: this.onHoldCurrentFlow.bind(this),
                    },
                }),
            });
        },

        createOriginFlowTable: function () {
            return new Table({
                header: new Header({
                    title: '<i class="fa fa-exchange"></i> Origin',
                }),
                data: this.originFlowTableData.bind(this),
                bodyRow: TableRow.extend({
                    template: _.template($('#flow-page-flow-table-row-template').html()),
                    data: this.flowTableRowData.bind(this),
                    events: {
                        click: function () {
                            if (app.authentication.hasRights('flow', 'view')) {
                                app.router.navigate('flow/' + this.row.get('id'));
                            }
                        },
                    },
                }),
            });
        },

        destinationFlowTableData: function (flow) {
            var flows = [];
            if (flow.get('type') == 'output') {
                var inputFlows = flow.findAll('flow');
                _.each(inputFlows, function (inputFlow) {
                    flows.push(inputFlow);
                    flows = _.union(flows, this.destinationFlowTableData(inputFlow));
                }.bind(this));
            }
            else {
                var inputTask = flow.find('task');
                var categoryName = inputTask.find('category').get('name');
                if (categoryName == 'Seeding' || categoryName == 'Planting') {
                    var crop = inputTask.find('crop');
                    if (crop) {
                        var outputTasks = _.filter(crop.findAll('task'), function (task) {
                            if (task.get('id') == inputTask.get('id')) return false;
                            var categoryName = task.find('category').get('name');
                            return categoryName == 'Harvesting';
                        });
                        _.each(outputTasks, function (outputTask) {
                            var outputFlows = outputTask.findAll('flow');
                            _.each(outputFlows, function (outputFlow) {
                                flows.push(outputFlow);
                                flows = _.union(flows, this.destinationFlowTableData(outputFlow));
                            }.bind(this));
                        }.bind(this));
                    }
                }
            }
            return _.sortBy(flows, function (flow) {
                return flow.get('date') + (flow.get('type') == 'input' ? '-2' : '-1');
            }).reverse();
        },

        originFlowTableData: function (flow) {
            var flows = [];
            if (flow.get('type') == 'input') {
                var outputFlow = flow.find('flow');
                flows.push(outputFlow);
                flows = _.union(flows, this.originFlowTableData(outputFlow));
            }
            else {
                var outputTask = flow.find('task');
                var crop = outputTask.find('crop');
                if (crop) {
                    var inputTasks = _.filter(crop.findAll('task'), function (task) {
                        if (task.get('id') == outputTask.get('id')) return false;
                        var categoryName = task.find('category').get('name');
                        return categoryName == 'Seeding' || categoryName == 'Planting';
                    });
                    _.each(inputTasks, function (inputTask) {
                        var inputFlows = inputTask.findAll('flow');
                        _.each(inputFlows, function (inputFlow) {
                            flows.push(inputFlow);
                            flows = _.union(flows, this.originFlowTableData(inputFlow));
                        }.bind(this));
                    }.bind(this));
                }
            }
            return _.sortBy(flows, function (flow) {
                return flow.get('date') + (flow.get('type') == 'input' ? '-2' : '-1');
            }).reverse();
        },

        flowTableRowData: function (flow) {
            var product = flow.find('product');
            var productCategory = product.find('category');
            var task = flow.find('task');
            var taskCategory = task.find('category');
            var provider = task.find('provider');
            var crop = task.find('crop');
            if (crop) {
                var variety = crop.find('variety');
            }
            var pos = task.find('pos');
            var output = flow.find('flow');
            return $.extend(flow.toJSON(), {
                product: product.toJSON(),
                productCategory: productCategory.toJSON(),
                task: product.toJSON(),
                taskCategory: taskCategory.toJSON(),
                provider: provider ? provider.toJSON() : null,
                crop: crop ? crop.toJSON() : null,
                variety: crop ? variety.toJSON() : null,
                pos: pos ? pos.toJSON() : null,
                flow: output ? output.toJSON() : null,
            });
        },

        render: function (options) {
            options = options || {};
            this.flow = options.flow || this.flow;
            var product = this.flow.find('product');
            var productCategory = product.find('category');

            Page.prototype.render.call(this, options);

            this.header.render();
            if (product.get('variety_id') == null || productCategory.get('name') != 'Seed') {
                this.header.items.navigation.render({
                    model: this.flow,
                });
                this.header.items.navigation.$el.show(0);
                this.header.items.seedNavigation.$el.hide(0);
            }
            else {
                this.header.items.seedNavigation.render({
                    model: this.flow,
                });
                this.header.items.navigation.$el.hide(0);
                this.header.items.seedNavigation.$el.show(0);
            }
            this.body.items.destinationFlowTable.render({
                data: this.flow,
            });
            this.body.items.currentFlowTable.render({
                data: this.flow,
            });
            this.body.items.originFlowTable.render({
                data: this.flow,
            });
        },

        onHoldCurrentFlow: function () {
            app.dialogs.get('flow').show({
                title: 'Edit ' + this.flow.getDisplayName(),
                form: {
                    data: this.flow.toJSON(),
                    visibility: {
                        garden_id: false,
                        task_id: false,
                        product_id: false,
                        flow_id: false,
                        type: false,
                        lot: false,
                    },
                },
            });
        },

        onClickSeedPocket: function () {
            var product = this.flow.find('product');
            var lot = this.flow.get('type') == 'input' ? this.flow.find('flow').get('lot') : this.flow.get('lot');
            var quantity = this.flow.get('quantity');
            app.dialogs.get('seed-pocket').show({
                title: 'Seed Pocket',
                form: {
                    data: {
                        variety_id: product.get('variety_id'),
                        provider_id: product.get('provider_id'),
                        harvest_date: this.flow.get('date'),
                        reference: product.get('reference'),
                        lot: lot,
                        quantity: quantity,
                        unit: product.get('quantity_unit'),
                    },
                    visibility: {
                        variety_id: false,
                        provider_id: false,
                    },
                },
            }).done(function (formData) {
                var pdf = new SeedPocketPdf({data: formData});
                pdf.render();
            }.bind(this));
        },
    });
});