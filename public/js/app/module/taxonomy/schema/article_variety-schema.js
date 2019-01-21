'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/taxonomy/form/article_variety-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        var plant = this.find('plant'),
                            variety = this.find('variety');
                        return _.isNull(variety) ? plant.getDisplayName() : variety.getDisplayName();
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        article_id: 'article',
                        plant_id: 'plant',
                        variety_id: 'variety', // Set Null
                    },
                    uniqueAttributes: ['article_id', 'plant_id', 'variety_id'],
                    comparator: 'id',
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