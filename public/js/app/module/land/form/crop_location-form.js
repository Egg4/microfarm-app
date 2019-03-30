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
                collection: app.collections.get('crop_location'),
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
                            name: 'crop_id',
                            cast: 'integer',
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'zone_id',
                                    placeholder: polyglot.t('form.placeholder.zone_id'),
                                    optgroup: true,
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    data: this.buildZoneData.bind(this),
                                    events: {
                                        change: this.resetBlockSelect.bind(this),
                                    },
                                }),
                                new Button({
                                    label: new Label({
                                        icon: new Icon({name: 'plus'}),
                                    }),
                                    events: {
                                        click: this.openZoneCreationDialog.bind(this),
                                    },
                                }),
                            ],
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'block_id',
                                    placeholder: polyglot.t('form.placeholder.block_id'),
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    data: this.buildBlockData.bind(this),
                                    events: {
                                        change: this.resetBedSelect.bind(this),
                                    },
                                }),
                                new Button({
                                    label: new Label({
                                        icon: new Icon({name: 'plus'}),
                                    }),
                                    events: {
                                        click: this.openBlockCreationDialog.bind(this),
                                    },
                                }),
                            ],
                        }),
                        new FormGroup({
                            type: 'horizontal',
                            items: [
                                new Select({
                                    name: 'bed_id',
                                    placeholder: polyglot.t('form.placeholder.bed_id'),
                                    cast: 'integer',
                                    css: {flex: '1'},
                                    data: this.buildBedData.bind(this),
                                }),
                                new Button({
                                    label: new Label({
                                        icon: new Icon({name: 'plus'}),
                                    }),
                                    events: {
                                        click: this.openBedCreationDialog.bind(this),
                                    },
                                }),
                            ],
                        }),
                    ],
                }),
            });
        },

        buildZoneData: function () {
            var data = [];
            app.collections.get('zone').each(function(zone) {
                data.push({
                    optgroup: zone.find('category').getDisplayName(),
                    value: zone.get('id'),
                    label: zone.getDisplayName(),
                });
            });
            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        openZoneCreationDialog: function () {
            var dialog = app.dialogs.get('zone');
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.zone').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
            });
            dialog.form.setVisible({
                category_id: true,
                name: true,
            });
            dialog.open().done(function (zone) {
                var zoneSelect = this.getElement('zone_id');
                zoneSelect.setValue(zone.get('id'));
                zoneSelect.render();
                $(zoneSelect.el).trigger('change');
            }.bind(this));
        },

        buildBlockData: function () {
            var zoneId = this.getElement('zone_id').getValue(),
                data = [],
                blocks = app.collections.get('block').where({
                    zone_id: zoneId,
                });
            _.each(blocks, function(block) {
                data.push({
                    value: block.get('id'),
                    label: block.get('name'),
                });
            });
            return data;
        },

        resetBlockSelect: function () {
            var blockSelect = this.getElement('block_id');
            blockSelect.setValue('');
            blockSelect.render();
            $(blockSelect.el).trigger('change');
        },

        openBlockCreationDialog: function () {
            var dialog = app.dialogs.get('block');
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.block').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
                zone_id: this.getElement('zone_id').getValue(),
            });
            dialog.form.setVisible({
                zone_id: false,
                name: true,
            });
            dialog.open().done(function (block) {
                var blockSelect = this.getElement('block_id');
                blockSelect.setValue(block.get('id'));
                blockSelect.render();
                $(blockSelect.el).trigger('change');
            }.bind(this));
        },

        buildBedData: function () {
            var blockId = this.getElement('block_id').getValue(),
                data = [],
                beds = app.collections.get('bed').where({
                    block_id: blockId,
                });
            _.each(beds, function(bed) {
                data.push({
                    value: bed.get('id'),
                    label: bed.get('name'),
                });
            });
            return data;
        },

        resetBedSelect: function () {
            var bedSelect = this.getElement('bed_id');
            bedSelect.setValue('');
            bedSelect.render();
            $(bedSelect.el).trigger('change');
        },

        openBedCreationDialog: function () {
            var dialog = app.dialogs.get('bed');
            dialog.setData({
                title: polyglot.t('model-dialog.title.create', {
                    model: polyglot.t('model.name.bed').toLowerCase(),
                }),
                icon: new Icon({name: 'plus'}),
            });
            dialog.form.setData({
                entity_id: this.getElement('entity_id').getValue(),
                block_id: this.getElement('block_id').getValue(),
            });
            dialog.form.setVisible({
                block_id: false,
                name: true,
            });
            dialog.open().done(function (bed) {
                var bedSelect = this.getElement('bed_id');
                bedSelect.setValue(bed.get('id'));
                bedSelect.render();
                $(bedSelect.el).trigger('change');
            }.bind(this));
        },
    });
});