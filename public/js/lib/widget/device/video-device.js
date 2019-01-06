'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/device/device',
], function ($, _, Device) {

    return Device.extend({
        tagName: 'video',

        initialize: function (options) {
            Device.prototype.initialize.call(this, options);

            $(this.el).addClass('video-device-widget');
        },

        load: function (options) {
            options = $.extend(true, {
                video: {
                    width: 320,
                    height: 240,
                    frameRate: 30,
                    facingMode: 'user',
                },
                audio: false,
            }, options);

            var deferred = $.Deferred();
            navigator.mediaDevices.getUserMedia(options).then(function(mediaStream) {
                this.el.srcObject = mediaStream;
                $(this.el).on('loadedmetadata', function() {
                    deferred.resolve();
                });
            }.bind(this)).catch(function(error) {
                deferred.reject(error);
            });

            return deferred.promise();
        },

        unload: function () {
            var stream = this.el.srcObject;
            if (stream) {
                _.each(stream.getVideoTracks(), function(videoTrack) {
                    videoTrack.stop();
                });
                _.each(stream.getAudioTracks(), function(audioTrack) {
                    audioTrack.stop();
                });
            }
            this.el.srcObject = null;
        },

        play: function () {
            this.el.play();
        },

        pause: function () {
            this.el.pause();
        },

        isPaused: function () {
            return this.el.paused;
        },

        drawTo: function (canvas) {
            canvas.width = this.el.videoWidth;
            canvas.height = this.el.videoHeight;
            canvas.getContext('2d').drawImage(this.el, 0, 0);
        },
    });
});