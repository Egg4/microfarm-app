'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/select-form-element',
    'view/widget/form/element/input-number-form-element',
    'view/widget/form/element/textarea-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select, InputNumber, Textarea) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'crop-form',
                collection: app.collections.get('crop'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                        }),
                        garden_id: new InputHidden({
                            name: 'garden_id',
                        }),
                        variety_id: new Select({
                            name: 'variety_id',
                            optgroup: true,
                            data: this.getVarietyData.bind(this),
                            validator: function (value) {
                                if (value.length == 0) {
                                    return 'Invalid variety';
                                }
                            },
                        }),
                        status: new Select({
                            name: 'status',
                            defaultValue: 'planned',
                            data: [
                                {value: 'planned', label: 'Planned'},
                                {value: 'in_progress', label: 'In progress'},
                                {value: 'complete', label: 'Complete'},
                            ],
                        }),
                        description: new Textarea({
                            name: 'description',
                            nullable: true,
                            placeholder: 'Description',
                        }),
                    },
                }),
            }, options));
        },

        getVarietyData: function () {
            var data = [];
            app.collections.get('variety').each(function(variety) {
                var species = variety.find('species');
                var genus = species.find('genus');
                data.push({
                    optgroup: genus.getDisplayName() + ' ' + species.getDisplayName(),
                    value: variety.get('id'),
                    label: variety.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },
    });
});