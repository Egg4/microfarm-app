'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/dialog/dialog',
    'lib/widget/layout/stack-layout',
    'lib/widget/device/video-device',
    'lib/widget/canvas/canvas',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Dialog, StackLayout, Video, Canvas, Button, Label, Icon) {

    return Dialog.extend({

        initialize: function () {
            Dialog.prototype.initialize.call(this, {
                id: 'camera-dialog',
                header: false,
                body: this.buildBody(),
                footer: false,
            });
        },

        buildBody: function () {
            return new StackLayout({
                className: 'dialog-body',
                items: [
                    this.buildVideo(),
                    this.buildCanvas(),
                    this.buildBackButton(),
                ],
            });
        },

        buildVideo: function () {
            return new Video({
                video: {
                    /*
                    width:  { min: 640, ideal: 800, max: 1280 },
                    height: { min: 480, ideal: 600, max: 840 },
                    */
                    width: 640,
                    height: 480,
                    facingMode: 'environment',
                },
                events: {
                    click: this.onVideoClick.bind(this),
                },
            });
        },

        getVideo: function () {
            return this.body.items[0];
        },

        buildCanvas: function () {
            return new Canvas({
                mimeType: 'image/jpeg',
                quality: 0.80,
            });
        },

        getCanvas: function () {
            return this.body.items[1];
        },

        buildBackButton: function () {
            return new Icon({
                className: 'back-button',
                name: 'long-arrow-alt-left',
                events: {
                    click: this.onBackButtonClick.bind(this),
                },
            });
        },

        onVideoClick: function() {
            var video = this.getVideo(),
                canvas = this.getCanvas();

            if (video.isPlaying()) {
                video.pause();
                canvas.drawImage(video.el, 0, 0, video.el.videoWidth, video.el.videoHeight);
            }
            else {
                video.unload().done(function () {
                    this.close();
                    var data = canvas.toDataURL();
                    this.deferred.resolve(data);
                }.bind(this));
            }
        },

        onBackButtonClick: function() {
            var video = this.getVideo(),
                canvas = this.getCanvas();

            if (video.isPlaying()) {
                video.unload().done(function () {
                    this.close();
                    this.deferred.reject();
                }.bind(this));
            }
            else {
                canvas.clear();
                video.play();
            }
        },

        render: function () {
            Dialog.prototype.render.call(this);

            var video = this.getVideo(),
                canvas = this.getCanvas();

            canvas.clear();

            app.loader.show();
            video.load().done(function() {
                video.play();
            }.bind(this)).fail(function(error) {
                console.log(error);
                //throw error
            }.bind(this)).always(function() {
                app.loader.hide();
            });
        },

        open: function () {
            this.deferred = $.Deferred();
            Dialog.prototype.open.call(this);
            return this.deferred.promise();
        },
    });
});