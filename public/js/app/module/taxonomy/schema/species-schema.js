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
                    displayName: 'name',
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        genus_id: {
                            model: 'genus',
                            onDelete: 'cascade',
                        },
                    },
                    uniqueKey: ['genus_id', 'name'],
                    comparator: 'name',
                },
            });
        },
    });
});