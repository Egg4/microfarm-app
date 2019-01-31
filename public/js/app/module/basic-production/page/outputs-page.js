'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/model-list-page',
    'app/widget/bar/header-bar',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'outputs-page',
                title: polyglot.t('outputs-page.title'),
                icon: new Icon({name: 'dolly'}),
                collection: app.collections.get('output'),
                tableOptions: {
                    models: this.buildOutputs.bind(this),
                    groupedModels: this.buildGroupedOutputs.bind(this),
                    modelRow: {
                        options: this.buildOutputRowOptions.bind(this),
                        template: _.template($('#outputs-page-output-table-row-template').html()),
                        data: this.buildOutputRowData.bind(this),
                    },
                    modelForm: {
                        data: this.buildOutputFormData.bind(this),
                        visible: this.buildOutputFormVisible.bind(this),
                    },
                },
            });
        },

        buildOutputs: function () {
            return this.collection.toArray();
        },

        buildGroupedOutputs: function (outputs) {
            return _.groupBy(outputs, function (output) {
                return output.find('task').find('crop').find('article').getDisplayName();
            });
        },

        buildOutputRowOptions: function (output) {
            return {
                className: output.find('task').get('done') ? '' : 'disabled',
            };
        },

        buildOutputRowData: function (output) {
            var task = output.find('task'),
                article = output.find('article'),
                category = article.find('category'),
                quantityUnit = article.find('category', {selfAttribute: 'quantity_unit_id'}),
                variety = output.find('variety');
            return $.extend(output.toJSON(), {
                    task: task.toJSON(),
                    article: article.toJSON(),
                    category: category.toJSON(),
                    quantity_unit: quantityUnit.toJSON(),
                    variety: _.isNull(variety) ? null : variety.toJSON(),
                    plant: _.isNull(variety) ? null : variety.find('plant').toJSON(),
            });
        },

        buildOutputFormData: function () {
            return {
                entity_id: app.authentication.getEntityId(),
            };
        },

        buildOutputFormVisible: function () {
            return {
                task_id: true,
                article_id: true,
                variety_id: true,
                quantity: true,
            };
        },
    });
});