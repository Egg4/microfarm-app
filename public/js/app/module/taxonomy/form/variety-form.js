'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/select-form-element',
    'lib/widget/form/element/input-text-form-element',
    'lib/widget/form/element/textarea-form-element',
    'lib/widget/form/element/checkbox-form-element',
    'lib/widget/form/label/form-label',
], function ($, _, Form, FormGroup, InputHidden, Select, InputText, Textarea, Checkbox, FormLabel) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                id: 'variety-form',
                collection: app.collections.get('variety'),
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
                        new Select({
                            name: 'plant_id',
                            placeholder: polyglot.t('form.placeholder.plant_id'),
                            optgroup: true,
                            cast: 'integer',
                            data: this.buildPlantData.bind(this),
                        }),
                        new InputText({
                            name: 'name',
                            placeholder: polyglot.t('form.placeholder.name'),
                        }),
                        new Textarea({
                            name: 'description',
                            placeholder: polyglot.t('form.placeholder.description'),
                            nullable: true,
                        }),
                        new FormGroup({
                            items: [
                                new Checkbox({
                                    name: 'active',
                                    label: new FormLabel({
                                        text: polyglot.t('form.placeholder.active'),
                                    }),
                                    cast: 'boolean',
                                }),
                            ],
                        }),
                    ],
                }),
            });
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