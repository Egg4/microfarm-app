'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({

        initialize: function (options) {
            $.extend(true, this, {
                mediaDeviceInfos: [],
            }, _.pick(options));

            Widget.prototype.initialize.call(this, options);

            $(this.el).addClass('media-widget');

            if (!navigator.mediaDevices) {
                console.log('navigator.mediaDevices not supported');
            } else {
                navigator.mediaDevices.enumerateDevices().then(function (deviceInfos) {
                    this.deviceInfos = deviceInfos;
                }.bind(this)).catch(function (error) {
                    console.log(error.name + ': ' + error.message);
                });
            }
        },
    });
});