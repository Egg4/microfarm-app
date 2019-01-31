'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
], function ($, _, Schema, Model, Collection) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: 'id',
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
            });
        },
    });
});