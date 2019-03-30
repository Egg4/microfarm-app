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
                collection: app.collections.get('role_access'),
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
                            name: 'role_id',
                            cast: 'integer',
                        }),
                        new Select({
                            name: 'resource',
                            placeholder: polyglot.t('form.placeholder.resource'),
                            optgroup: true,
                            data: this.buildResourceData.bind(this),
                        }),
                        new FormGroup({
                            items: [
                                new Checkbox({
                                    name: 'create',
                                    label: new FormLabel({
                                        text: polyglot.t('form.placeholder.create'),
                                    }),
                                    cast: 'boolean',
                                }),
                                new Checkbox({
                                    name: 'update',
                                    label: new FormLabel({
                                        text: polyglot.t('form.placeholder.update'),
                                    }),
                                    cast: 'boolean',
                                }),
                                new Checkbox({
                                    name: 'delete',
                                    label: new FormLabel({
                                        text: polyglot.t('form.placeholder.delete'),
                                    }),
                                    cast: 'boolean',
                                }),
                            ],
                        }),
                    ],
                }),
            });
        },

        buildResourceData: function () {
            var data = [];
            data = _.union(data, this.buildCropItems());
            data = _.union(data, this.buildEntityItems());
            data = _.union(data, this.buildZoneItems());

            return _.groupBy(_.sortBy(data, 'optgroup'), 'optgroup');
        },

        buildEntityItems: function () {
            var optGroup = polyglot.t('model.name.entity'),
                modelNames = ['article', 'variety', 'article_variety', 'organization'];

            return _.map(modelNames, function(modelName) {
                return this.buildResourceItem(optGroup, modelName);
            }.bind(this));
        },

        buildCropItems: function () {
            var optGroup = polyglot.t('model.name.crop'),
                modelNames = ['crop', 'task', 'working', 'seedling', 'transplanting', 'planting', 'output', 'photo'];

            return _.map(modelNames, function(modelName) {
                return this.buildResourceItem(optGroup, modelName);
            }.bind(this));
        },

        buildZoneItems: function () {
            var optGroup = polyglot.t('model.name.zone'),
                modelNames = ['zone', 'block', 'bed', 'crop_location'];

            return _.map(modelNames, function(modelName) {
                return this.buildResourceItem(optGroup, modelName);
            }.bind(this));
        },

        buildResourceItem: function (optGroup, modelName) {
            return {
                optgroup: optGroup,
                value: modelName,
                label: polyglot.t('model.name.' + modelName),
            };
        },
    });
});