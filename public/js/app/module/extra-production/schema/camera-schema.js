'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'app/module/extra-production/dialog/camera-dialog',
], function ($, _, Schema, Dialog) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                dialog: {
                    class: Dialog,
                },
            });
        },
    });
});