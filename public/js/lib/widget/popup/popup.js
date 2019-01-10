'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            var defaults = {
                layout: false,
                theme: 'a',
                overlayTheme: 'b',
                transition: 'pop',
                positionTo: 'windows',
                shadow: true,
                dismissible: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('popup-widget');
            $('body').append(this.el);

            $(this.el).popup({
                theme: this.theme,
                overlayTheme: this.overlayTheme,
                transition: this.transition,
                positionTo: this.positionTo,
                shadow: this.shadow,
                dismissible: this.dismissible,
                afteropen: function() {
                    if (this.deferredOpen) {
                        this.deferredOpen.resolve();
                    }
                }.bind(this),
                afterclose: function() {
                    this.opened = false;
                    if (this.deferredClose) {
                        this.deferredClose.resolve();
                    }
                }.bind(this),
            });
        },

        render: function () {
            Widget.prototype.render.call(this);

            var layout = _.isFunction(this.layout) ? this.layout() : this.layout;
            $(this.el).html(layout.el);
            layout.render();

            $(this.el).popup({
                enhanced: true,
            });
        },

        open: function () {
            this.opened = true;
            this.deferredOpen = $.Deferred();
            $(this.el).popup('open')
            return this.deferredOpen.promise();
        },

        close: function () {
            this.deferredClose = $.Deferred();
            $(this.el).popup('close');
            return this.deferredClose.promise();
        },

        isOpened: function () {
            return this.opened || false;
        },
    });
});