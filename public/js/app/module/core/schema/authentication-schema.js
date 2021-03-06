'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'app/module/core/page/authentication-page',
], function ($, _, Schema, Page) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                page: {
                    class: Page,
                    routes: [{
                        pattern: 'authentication',
                    }],
                },
            });
        },
    });
});