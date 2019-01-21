'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/taxonomy/form/variety-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        return this.find('plant').getDisplayName() + ' ' + this.get('name');
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        entity_id: 'entity',
                        plant_id: 'plant',
                    },
                    uniqueAttributes: ['plant_id', 'name'],
                    comparator: 'name',
                },
                form: {
                    class: Form,
                },
                dialog: {
                    class: Dialog,
                },
            });
        },
    });
});