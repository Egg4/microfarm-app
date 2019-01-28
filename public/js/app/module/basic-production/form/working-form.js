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
                id: 'working-form',
                collection: app.collections.get('working'),
                formGroup: new FormGroup({
                    items: [
                        new InputHidden({
                            name: 'id',
                            required: false,
                        }),
                        new InputHidden({
                            name: 'entity_id',
                        }),
                        new InputHidden({
                            name: 'task_id',
                        }),
                        new InputHidden({
                            name: 'user_id',
                        }),
                        new Select({
                            name: 'duration',
                            placeholder: polyglot.t('form.placeholder.duration'),
                            data: this.buildDurationData.bind(this),
                        }),
                    ],
                }),
            });
        },

        buildDurationData: function () {
            return [
                {value: '00:15:00', label: '00:15'},
                {value: '00:30:00', label: '00:30'},
                {value: '00:45:00', label: '00:45'},
                {value: '01:00:00', label: '01:00'},
                {value: '01:30:00', label: '01:30'},
                {value: '02:00:00', label: '02:00'},
                {value: '02:30:00', label: '02:30'},
                {value: '03:00:00', label: '03:00'},
                {value: '04:00:00', label: '04:00'},
                {value: '06:00:00', label: '06:00'},
                {value: '08:00:00', label: '08:00'},
                {value: '12:00:00', label: '12:00'},
            ];
        },
    });
});