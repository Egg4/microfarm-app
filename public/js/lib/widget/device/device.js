'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        infos: [],

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            $(this.el).addClass('device-widget');

            if (!navigator.mediaDevices) {
                throw new Error('Media devices not supported');
            } else {
                navigator.mediaDevices.enumerateDevices().then(function (deviceInfos) {
                    this.infos = deviceInfos;
                }.bind(this)).catch(function (error) {
                    console.log(error.name + ': ' + error.message);
                    throw new Error(error.name + ': ' + error.message);
                });
            }
        },
    });
});