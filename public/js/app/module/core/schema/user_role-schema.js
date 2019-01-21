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
                        entity_id: 'entity',
                        user_id: 'user',
                        role_id: 'role',
                    },
                    uniqueAttributes: ['user_id'],
                    comparator: 'id',
                },
            });
        },
    });
});