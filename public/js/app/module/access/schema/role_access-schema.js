'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/access/form/role_access-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        return polyglot.t('model.name.' + this.get('resource'));
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        role_id: {
                            model: 'role',
                            onDelete: 'cascade',
                        },
                    },
                    uniqueKey: ['role_id', 'resource'],
                    comparator: 'resource',
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