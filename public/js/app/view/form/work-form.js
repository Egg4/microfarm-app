'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/select-form-element',
    'view/widget/form/element/input-date-form-element',
    'view/widget/form/element/input-number-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select, InputDate, InputNumber) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'work-form',
                collection: app.collections.get('work'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                        }),
                        garden_id: new InputHidden({
                            name: 'garden_id',
                        }),
                        task_id: new Select({
                            name: 'task_id',
                            optgroup: true,
                            data: this.getTaskData.bind(this),
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid task';
                                }
                            },
                        }),
                        date: new InputDate({
                            name: 'date',
                            placeholder: 'Date',
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid date';
                                }
                            },
                        }),
                        duration: new InputNumber({
                            name: 'duration',
                            placeholder: 'Duration',
                            min: 0,
                            max: 48,
                            step: 0.5,
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid duration';
                                }
                            },
                        }),
                        unit: new InputHidden({
                            name: 'unit',
                            defaultValue: 'h/m',
                        }),
                    },
                }),
            }, options));
        },

        getTaskData: function () {
            var data = [];
            app.collections.get('task').each(function(task) {
                var optgroup = '';
                var provider = task.find('provider');
                if (provider) {
                    optgroup = provider.getDisplayName();
                }
                var crop = task.find('crop');
                if (crop) {
                    optgroup = crop.getDisplayName();
                }
                var pos = task.find('pos');
                if (pos) {
                    optgroup = pos.getDisplayName();
                }
                data.push({
                    optgroup: optgroup,
                    value: task.get('id'),
                    label: task.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        validate: function (data) {
            var errors = [];
            if (!this.collection.checksUniqueKey(data, ['task_id', 'date'])) {
                errors.push({
                    attributes: ['task_id', 'date'],
                    message: 'This work already exists',
                });
            }
            return errors;
        },
    });
});