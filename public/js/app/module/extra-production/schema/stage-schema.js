'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/extra-production/form/stage-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        var variety = this.find('variety'),
                            suffix = variety ? variety.getDisplayName() : '',
                            displayname = polyglot.t('model.name.stage') + ' ' + suffix;

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
                        variety_id: {
                            model: 'variety',
                            onDelete: 'cascade',
                        },
                    },
                    uniqueKey: ['task_id', 'variety_id'],
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