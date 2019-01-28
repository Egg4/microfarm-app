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
                id: 'block-form',
                collection: app.collections.get('block'),
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
                            name: 'zone_id',
                        }),
                        new Select({
                            name: 'name',
                            placeholder: polyglot.t('form.placeholder.name'),
                            data: this.buildNameData.bind(this),
                        }),
                    ],
                }),
            });
        },

        buildNameData: function () {
            var zoneId = this.getElement('zone_id').getValue(),
                name = this.getElement('name').getValue(),
                data = [];

            for (var index = 65; index < 91; index++) {
                var char = String.fromCharCode(index),
                    block = null;
                if (char != name) {
                    block = app.collections.get('block').findWhere({
                        zone_id: zoneId,
                        name: char,
                    });
                }
                if (!block) {
                    data.push({
                        value: char,
                        label: char,
                    });
                }
            }

            return data;
        },
    });
});