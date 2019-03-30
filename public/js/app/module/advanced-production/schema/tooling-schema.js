'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/advanced-production/form/tooling-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        return this.find('article').getDisplayName();
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
                    },
                    uniqueKey: ['task_id', 'article_id'],
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