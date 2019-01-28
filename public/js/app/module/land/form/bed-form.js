'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/select-form-element',
    'lib/widget/form/element/input-number-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select, InputNumber) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                id: 'bed-form',
                collection: app.collections.get('bed'),
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
                            name: 'block_id',
                        }),
                        new InputNumber({
                            name: 'name',
                            placeholder: polyglot.t('form.placeholder.name'),
                            min: 1,
                            cast: 'integer',
                        }),
                    ],
                }),
            });
        },

        buildNameValue: function () {
            var blockId = this.getElement('block_id').getValue(),
                name = this.getElement('name').getValue();

            if (!name) {
                for (var index = 1; index < 1024; index++) {
                    var bed = app.collections.get('bed').findWhere({
                        block_id: blockId,
                        name: index,
                    });
                    if (!bed) {
                        name = index;
                        break;
                    }
                }
            }

            this.getElement('name').setValue(name);
        },

        render: function () {
            Form.prototype.render.call(this);
            this.buildNameValue();
        },
    });
});