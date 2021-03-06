'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/core/form/user_role-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        return this.find('user').getDisplayName();
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        user_id: {
                            model: 'user',
                            onDelete: 'cascade',
                        },
                        role_id: {
                            model: 'role',
                            onDelete: 'cascade',
                        },
                    },
                    uniqueKey: ['user_id'],
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