'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/input-text-form-element',
], function ($, _, Form, FormGroup, InputHidden, InputText) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'garden-form',
                collection: app.collections.get('garden'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                            required: false,
                        }),
                        garden_id: new InputHidden({
                            name: 'entity_id',
                        }),
                        name: new InputText({
                            name: 'name',
                            placeholder: 'Nom',
                        }),
                    },
                }),
            }, options));
        },
    });
});