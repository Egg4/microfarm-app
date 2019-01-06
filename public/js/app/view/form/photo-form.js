'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/select-form-element',
    'view/widget/form/element/input-date-form-element',
    'view/widget/form/element/input-text-form-element',
    'view/widget/form/element/input-photo-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select, InputDate, InputText, InputPhoto) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'photo-form',
                collection: app.collections.get('photo'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                            required: false,
                        }),
                        garden_id: new InputHidden({
                            name: 'garden_id',
                        }),
                        task_id: new Select({
                            name: 'task_id',
                            nullable: true,
                            optgroup: true,
                            data: this.getTaskData.bind(this),
                        }),
                        snapshot_id: new Select({
                            name: 'snapshot_id',
                            nullable: true,
                            optgroup: true,
                            data: this.getSnapshotData.bind(this),
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
                        title: new InputText({
                            name: 'title',
                            placeholder: 'Title',
                        }),
                        url: new InputPhoto({
                            name: 'url',
                            height: '220px',
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid photo';
                                }
                            },
                            events: {
                                click: function() {
                                    app.panels.get('camera').show().done(function(url) {
                                        this.getElement('url').setValue(url);
                                        this.getElement('url').render();
                                    }.bind(this));
                                }.bind(this),
                            },
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

        getSnapshotData: function () {
            var data = [];
            app.collections.get('snapshot').each(function(snapshot) {
                var crop = snapshot.find('crop');
                data.push({
                    optgroup: crop.getDisplayName(),
                    value: snapshot.get('id'),
                    label: snapshot.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        validate: function (data) {
            var errors = [];
            if (data.task_id == null && data.snapshot_id == null) {
                errors.push({
                    attributes: ['task_id', 'snapshot_id'],
                    message: 'Task & snapshot cannot be null',
                });
            }
            return errors;
        },
    });
});
