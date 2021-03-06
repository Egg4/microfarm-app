'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/basic-production/form/working-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        return polyglot.t('model.name.working') + ' ' + this.get('duration').substring(0, 5) + ' - ' + this.get('mwu') + polyglot.t('model.field.mwu');
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        task_id: {
                            model: 'task',
                            onDelete: 'cascade',
                        },
                        user_id: {
                            model: 'user',
                            onDelete: 'cascade',
                        },
                    },
                    uniqueKey: ['task_id', 'user_id'],
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