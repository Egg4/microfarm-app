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
                id: 'article_variety-form',
                collection: app.collections.get('article_variety'),
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
                            name: 'article_id',
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'plant_id',
                                    optgroup: true,
                                    cast: 'integer',
                                    css: {flex: '0.5'},
                                    data: this.buildPlantData.bind(this),
                                    events: {
                                        change: this.onChangePlant.bind(this),
                                    },
                                }),
                                new Select({
                                    name: 'variety_id',
                                    optgroup: true,
                                    nullable: true,
                                    cast: 'integer',
                                    css: {flex: '0.5'},
                                    data: this.buildVarietyData.bind(this),
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
                data.push({
                    optgroup: plant.getDisplayName().charAt(0).removeDiacritics().toUpperCase(),
                    value: plant.get('id'),
                    label: plant.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        buildVarietyData: function () {
            var plantId = this.getElement('plant_id').getValue(),
                data = [{
                    optgroup: '-',
                    value: null,
                    label: polyglot.t('form.select.label.all'),
                }],
                varieties = app.collections.get('variety').where({
                    plant_id: plantId,
                });
            _.each(varieties, function(variety) {
                data.push({
                    optgroup: variety.get('name').charAt(0).removeDiacritics().toUpperCase(),
                    value: variety.get('id'),
                    label: variety.get('name'),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        onChangePlant: function () {
            var varietySelect = this.getElement('variety_id');
            varietySelect.setValue(null);
            varietySelect.render();
        },
    });
});