'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/core/page/entity-page',
], function ($, _, Schema, Model, Collection, Page) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: 'name',
                },
                collection: {
                    class: Collection,
                    uniqueAttributes: ['name'],
                    comparator: 'name',
                },
                page: {
                    class: Page,
                    routes: [{
                        pattern: 'entity',
                    }],
                },
            });
        },
    });
});