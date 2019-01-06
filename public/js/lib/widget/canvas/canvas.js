'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'canvas',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            $(this.el).addClass('canvas-widget');
        },

        clear: function () {
            this.el.getContext('2d').clearRect(0, 0, this.el.width, this.el.height);
        },

        toDataURL: function (options) {
            options = $.extend(true, {
                mimeType: 'image/png',
                quality: 1,
            }, options);

            return this.el.toDataURL(options.mimeType, options.quality);
        },

        toBlob: function (options) {
            options = $.extend(true, {
                mimeType: 'image/png',
                quality: 1,
            }, options);

            var deferred = $.Deferred();
            this.el.toBlob(function(blob) {
                deferred.resolve(blob);
            }, options.mimeType, options.quality);

            return deferred.promise();
        },
    });
});