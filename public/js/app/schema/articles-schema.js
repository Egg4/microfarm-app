'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'app/view/page/articles-page',
], function ($, _, Schema, Page) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                page: {
                    class: Page,
                    routes: [{
                        pattern: 'entity/articles',
                    }, {
                        pattern: 'organization/:id/articles',
                    }],
                },
            });
        },
    });
});