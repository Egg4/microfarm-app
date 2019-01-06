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
                    displayName: 'value',
                },
                collection: {
                    class: Collection,
                    uniqueAttributes: ['parent_id', 'key'],
                    comparator: function () {
                        return this.get('parent_id') + this.get('key');
                    },
                },
            });
        },
    });
});