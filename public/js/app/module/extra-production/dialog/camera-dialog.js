'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/dialog/dialog',
    'lib/widget/layout/stack-layout',
    'lib/widget/device/video-device',
    'lib/widget/canvas/canvas',
    'lib/widget/icon/fa-icon',
], function ($, _, Dialog, StackLayout, Video, Canvas, Icon) {

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
                    this.buildCancelButton(),
                    this.buildValidateButton(),
                ],
            });
        },

        buildVideo: function () {
            return new Video({
                video: $.extend({
                    width: 320,
                    height: 240,
                    facingMode: 'environment',
                }, app.config.camera.video),
                events: {
                    click: this.validate.bind(this),
                },
            });
        },

        getVideo: function () {
            return this.body.items[0];
        },

        buildCanvas: function () {
            return new Canvas($.extend({
                mimeType: 'image/jpeg',
                quality: 0.75,
            }, app.config.camera.photo));
        },

        getCanvas: function () {
            return this.body.items[1];
        },

        buildCancelButton: function () {
            return new Icon({
                className: 'button cancel-button',
                events: {
                    click: this.cancel.bind(this),
                },
            });
        },

        getCancelButton: function () {
            return this.body.items[2];
        },

        buildValidateButton: function () {
            return new Icon({
                className: 'button validate-button',
                events: {
                    click: this.validate.bind(this),
                },
            });
        },

        getValidateButton: function () {
            return this.body.items[3];
        },

        cancel: function() {
            var video = this.getVideo(),
                canvas = this.getCanvas(),
                cancelButton = this.getCancelButton(),
                validateButton = this.getValidateButton();

            if (video.isPlaying()) {
                video.unload().done(function () {
                    this.close();
                    this.deferred.reject();
                }.bind(this));
            }
            else {
                canvas.clear();
                video.play();
                cancelButton.setData({name: 'long-arrow-alt-left'});
                cancelButton.render();
                validateButton.setData({name: 'camera-retro'});
                validateButton.render();
            }
        },

        validate: function() {
            var video = this.getVideo(),
                canvas = this.getCanvas(),
                cancelButton = this.getCancelButton(),
                validateButton = this.getValidateButton();

            if (video.isPlaying()) {
                video.pause();
                canvas.drawImage(video.el, 0, 0, video.el.videoWidth, video.el.videoHeight);
                cancelButton.setData({name: 'times'});
                cancelButton.render();
                validateButton.setData({name: 'check'});
                validateButton.render();
            }
            else {
                video.unload().done(function () {
                    this.close();
                    this.deferred.resolve(canvas.toDataURL());
                }.bind(this));
            }
        },

        render: function () {
            Dialog.prototype.render.call(this);

            var video = this.getVideo(),
                canvas = this.getCanvas(),
                cancelButton = this.getCancelButton(),
                validateButton = this.getValidateButton();

            canvas.clear();
            cancelButton.setData({name: 'long-arrow-alt-left'});
            cancelButton.render();
            validateButton.setData({name: 'camera-retro'});
            validateButton.render();

            app.loader.show();
            video.load()
                .done(function() {
                    video.play();
                })
                .always(function() {
                    app.loader.hide();
                })
                .fail(function(error) {
                    this.close();
                    this.deferred.reject(error);
                }.bind(this));
        },

        open: function () {
            this.deferred = $.Deferred();
            Dialog.prototype.open.call(this);
            return this.deferred.promise();
        },
    });
});