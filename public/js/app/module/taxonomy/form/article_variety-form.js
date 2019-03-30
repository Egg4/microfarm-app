'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/model-form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/select-form-element',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Form, FormGroup, InputHidden, Select, Button, Label, Icon) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                collection: app.collections.get('article_variety'),
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
                        new InputHidden({
                            name: 'article_id',
                            cast: 'integer',
                        }),
                        new Select({
                            name: 'plant_id',
                            placeholder: polyglot.t('form.placeholder.plant_id'),
                            optgroup: true,
                            cast: 'integer',
                            data: this.buildPlantData.bind(this),
                            events: {
                                change: this.resetVariety.bind(this),
                            },
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'variety_id',
                                    placeholder: polyglot.t('form.placeholder.variety_id'),
                                    optgroup: true,
                                    nullable: true,
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    data: this.buildVarietyData.bind(this),
                                }),
                                new Button({
                                    label: new Label({
                                        icon: new Icon({name: 'plus'}),
                                    }),
                                    events: {
                                        click: this.openVarietyCreationDialog.bind(this),
                                    },
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

        resetVariety: function () {
            var varietySelect = this.getElement('variety_id');
            varietySelect.setValue(null);
            varietySelect.render();
            $(varietySelect.el).trigger('change');
        },

        buildVarietyData: function () {
            var plantId = this.getElement('plant_id').getValue(),
                varietyId = this.getElement('variety_id').getValue(),
                data = [],
                varieties = app.collections.get('variety').where({
                    plant_id: plantId,
                    active: true,
                });
            if (varietyId) {
                var variety = app.collections.get('variety').get(varietyId);
                if (!_.contains(varieties, variety)) varieties.push(variety);
            }
            varieties = _.sortBy(varieties, function (variety) {
                return variety.getDisplayName();
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

        openVarietyCreationDialog: function () {
            var plantId = this.getElement('plant_id').getValue(),
                plant = app.collections.get('plant').get(plantId),
                dialog = app.dialogs.get('variety');

            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.variety').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            var formData = {};
            if (plant) {
                formData.plant_id = plant.get('id');
            }
            dialog.form.setData($.extend(formData, {
                entity_id: this.getElement('entity_id').getValue(),
                active: true,
            }));
            dialog.form.setVisible({});
            dialog.form.setDisabled({
                active: true,
            });
            dialog.open().done(function (variety) {
                var varietySelect = this.getElement('variety_id');
                varietySelect.setValue(variety.get('id'));
                varietySelect.render();
                $(varietySelect.el).trigger('change');
            }.bind(this));
        },
    });
});