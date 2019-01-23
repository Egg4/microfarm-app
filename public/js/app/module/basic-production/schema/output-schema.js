'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/basic-production/form/output-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        var article = this.find('article'),
                            quantityUnit = article.find('category', {selfAttribute: 'quantity_unit_id'}).get('value');
                        return article.getDisplayName() + ' - ' + this.get('quantity') + ' ' + quantityUnit;
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        entity_id: 'entity',
                        task_id: 'task',
                        article_id: 'article',
                        //variety_id: 'variety', // Set Null
                    },
                    uniqueAttributes: ['task_id', 'article_id', 'variety_id'],
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