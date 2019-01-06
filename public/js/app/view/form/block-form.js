'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/select-form-element',
    'view/widget/form/element/input-text-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select, InputText) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'block-form',
                collection: app.collections.get('block'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                            required: false,
                        }),
                        entity_id: new InputHidden({
                            name: 'entity_id',
                        }),
                        garden_id: new Select({
                            name: 'garden_id',
                            cast: 'integer',
                            data: this.buildGardenData.bind(this),
                        }),
                        name: new InputText({
                            name: 'name',
                            placeholder: 'Name',
                        }),
                    },
                }),
            }, options));
        },

        buildGardenData: function () {
            var data = [];
            app.collections.get('garden').each(function(garden) {
                data.push({
                    value: garden.get('id'),
                    label: garden.getDisplayName(),
                });
            });
            return data;
        },
    });
});