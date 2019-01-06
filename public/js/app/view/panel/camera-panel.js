'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/panel/panel',
    'view/widget/body/body',
    'view/widget/device/video-device',
    'view/widget/canvas/canvas',
    'view/widget/bar/grid-bar',
    'view/widget/button/button',
], function ($, _, Panel, Body, VideoDevice, Canvas, GridBar, Button) {

    return Panel.extend({

        initialize: function () {
            this.settings = {
                video: {
                    width: 640,
                    height: 480,
                },
                photo: {
                    mimeType: 'image/jpeg',
                    quality: 0.80,
                },
            };

            this.video = new VideoDevice();
            $(this.video.el).on('click', this.onVideoClick.bind(this));
            this.videoBar = new GridBar({items: {
                close: new Button({
                    text: 'Close',
                    icon: 'delete',
                    theme: 'a',
                    events: {
                        click: this.onClose.bind(this),
                    },
                }),
                snapshot: new Button({
                    text: 'Snapshot',
                    icon: 'camera',
                    theme: 'b',
                    events: {
                        click: this.onVideoClick.bind(this),
                    },
                }),
            }}),
            this.canvas = new Canvas();
            this.canvasBar = new GridBar({items: {
                camera: new Button({
                    text: 'Camera',
                    icon: 'back',
                    theme: 'a',
                    events: {
                        click: this.onCamera.bind(this),
                    },
                }),
                select: new Button({
                    text: 'Select',
                    icon: 'check',
                    theme: 'b',
                    events: {
                        click: this.onSelect.bind(this),
                    },
                }),
            }}),

            Panel.prototype.initialize.call(this, {
                id: 'camera-panel',
                fullscreen: true,
                body: new Body({
                    items: {
                        videoBar: this.videoBar,
                        video: this.video,
                        canvasBar: this.canvasBar,
                        canvas: this.canvas,
                    },
                }),
            });
        },

        render: function (options) {
            Panel.prototype.render.call(this, options);

            this.canvas.clear();
            $(this.video.el).show(0);
            $(this.videoBar.el).show(0);
            $(this.canvas.el).hide(0);
            $(this.canvasBar.el).hide(0);

            app.loader.show();
            this.video.load({
                video: this.settings.video,
            }).done(function() {
                this.video.play();
            }.bind(this)).fail(function(error) {
                this.close();
                app.dialogs.closeAll().done(function() {
                    app.dialogs.get('error').show({
                        title: 'Error',
                        errors: [{
                            name: error.name,
                            description: error.message,
                        }],
                    });
                }.bind(this));
            }.bind(this)).always(function() {
                app.loader.hide();
            });
        },

        show: function (options) {
            this.deferred = $.Deferred();
            this.render(options);
            this.open();
            return this.deferred.promise();
        },

        close: function () {
            this.video.unload();
            Panel.prototype.close.call(this);
        },

        onVideoClick: function() {
            this.video.pause();
            this.video.drawTo(this.canvas.el);
            $(this.video.el).hide(0);
            $(this.videoBar.el).hide(0);
            $(this.canvas.el).show(0);
            $(this.canvasBar.el).show(0);
        },

        onCamera: function() {
            this.canvas.clear();
            this.video.play();
            $(this.video.el).show(0);
            $(this.videoBar.el).show(0);
            $(this.canvas.el).hide(0);
            $(this.canvasBar.el).hide(0);
        },

        onClose: function() {
            this.close();
        },

        onSelect: function() {
            this.close();
            var data = this.canvas.toDataURL(this.settings.photo);
            this.deferred.resolve(data);
        },
    });
});