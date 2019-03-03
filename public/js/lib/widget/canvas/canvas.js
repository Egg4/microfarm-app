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

            var defaults = {
                mimeType: 'image/png',
                quality: 1,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('canvas-widget');
        },

        clear: function () {
            this.el.getContext('2d').clearRect(0, 0, this.el.width, this.el.height);
        },

        drawImage: function (element, x, y, width, height) {
            this.el.width = width;
            this.el.height = height;
            this.el.getContext('2d').drawImage(element, x, y);
        },

        toDataURL: function (options) {
            options = $.extend(true, {
                mimeType: this.mimeType,
                quality: this.quality,
            }, options);

            return this.el.toDataURL(options.mimeType, options.quality);
        },

        toBlob: function (options) {
            options = $.extend(true, {
                mimeType: this.mimeType,
                quality: this.quality,
            }, options);

            var deferred = $.Deferred();
            this.el.toBlob(function(blob) {
                deferred.resolve(blob);
            }, options.mimeType, options.quality);

            return deferred.promise();
        },
    });
});