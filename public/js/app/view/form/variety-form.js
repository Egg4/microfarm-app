'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/model-form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-hidden-form-element',
    'view/widget/form/element/select-form-element',
    'view/widget/form/element/input-text-form-element',
    'view/widget/form/element/checkbox-form-element',
], function ($, _, Form, FormGroup, InputHidden, Select, InputText, Checkbox) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, $.extend(true, {
                id: 'variety-form',
                collection: app.collections.get('variety'),
                formGroup: new FormGroup({
                    items: {
                        id: new InputHidden({
                            name: 'id',
                            required: false,
                        }),
                        entity_id: new InputHidden({
                            name: 'entity_id',
                        }),
                        plant_id: new Select({
                            name: 'plant_id',
                            optgroup: true,
                            cast: 'integer',
                            data: this.buildPlantData.bind(this),
                        }),
                        name: new InputText({
                            name: 'name',
                            placeholder: 'Nom',
                        }),
                        formGroup: new FormGroup({
                            items: {
                                active: new Checkbox({
                                    name: 'active',
                                    label: 'Actif',
                                    cast: 'boolean',
                                }),
                            },
                        }),
                    },
                }),
            }, options));
        },

        buildPlantData: function () {
            var data = [];
            app.collections.get('plant').each(function(plant) {
                var species = plant.find('species');
                var genus = species.find('genus');
                data.push({
                    optgroup: plant.getDisplayName().charAt(0).removeDiacritics().toUpperCase(),
                    value: plant.get('id'),
                    label: plant.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },
    });
});