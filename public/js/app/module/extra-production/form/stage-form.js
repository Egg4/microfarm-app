'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/select-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                collection: app.collections.get('stage'),
                formGroup: new FormGroup({
                    items: [
                        new InputHidden({
                            name: 'id',
                            required: false,
                            cast: 'integer',
                        }),
                        new InputHidden({
                            name: 'entity_id',
                            cast: 'integer',
                        }),
                        new InputHidden({
                            name: 'task_id',
                            cast: 'integer',
                        }),
                        new Select({
                            name: 'variety_id',
                            placeholder: polyglot.t('form.placeholder.variety_id'),
                            nullable: true,
                            cast: 'integer',
                            css: {flex: '1'},
                            data: this.buildVarietyData.bind(this),
                        }),
                    ],
                }),
            });
        },

        buildVarietyData: function () {
            var taskId = this.getElement('task_id').getValue(),
                task = app.collections.get('task').get(taskId),
                article = task.find('crop').find('article'),
                plantIds = _.map(article.findAll('article_variety'), function(articleVariety) {
                    return articleVariety.get('plant_id');
                }),
                data = [{
                    value: null,
                    label: polyglot.t('model.field.variety_id.null'),
                }],
                varieties = app.collections.get('variety').where({
                    plant_id: plantIds,
                });

            varieties = _.sortBy(varieties, function (variety) {
                return variety.getDisplayName();
            });
            _.each(varieties, function(variety) {
                data.push({
                    value: variety.get('id'),
                    label: variety.getDisplayName(),
                });
            });
            return data;
        },
    });
});