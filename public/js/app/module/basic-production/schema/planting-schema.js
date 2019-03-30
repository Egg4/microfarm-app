'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/basic-production/form/planting-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        var article = this.find('article'),
                            variety = this.find('variety'),
                            suffix = variety ? variety.getDisplayName() : article.getDisplayName(),
                            displayname = polyglot.t('model.name.planting') + ' ' + suffix;

                        return displayname.charAt(0).toUpperCase() + displayname.slice(1).toLowerCase();
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        task_id: {
                            model: 'task',
                            onDelete: 'cascade',
                        },
                        article_id: {
                            model: 'article',
                            onDelete: 'cascade',
                        },
                        output_id: {
                            model: 'output',
                            onDelete: 'set_null',
                        },
                        variety_id: {
                            model: 'variety',
                            onDelete: 'cascade',
                        },
                        category_id: {
                            model: 'category',
                            onDelete: 'cascade',
                        },
                    },
                    uniqueKey: ['task_id', 'article_id', 'output_id', 'variety_id'],
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