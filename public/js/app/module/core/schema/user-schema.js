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
                    displayName: function () {
                        return this.get('first_name') + ' ' + this.get('last_name');
                    },
                },
                collection: {
                    class: Collection,
                    uniqueAttributes: ['email'],
                    comparator: 'email',
                },
            });
        },
    });
});