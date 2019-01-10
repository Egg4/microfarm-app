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
                position: 'left',
                positionFixed: true,
                display: 'overlay',
                dismissible: false,
                animate: true,
                swipeClose: false,
                theme: 'a',
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('panel-widget');
            $('body').append(this.el);

            $(this.el).panel({
                position: this.position,
                positionFixed: this.positionFixed,
                display: this.display,
                dismissible: this.dismissible,
                animate: this.animate,
                swipeClose: this.swipeClose,
                theme: this.theme,
                open: function() {
                    if (this.deferredOpen) {
                        this.deferredOpen.resolve();
                    }
                }.bind(this),
                close: function() {
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

            $(this.el).panel({
                enhanced: true,
            });
        },

        open: function () {
            this.opened = true;
            this.deferredOpen = $.Deferred();
            $(this.el).panel('open');
            return this.deferredOpen.promise();
        },

        close: function () {
            this.deferredClose = $.Deferred();
            $(this.el).panel('close');
            return this.deferredClose.promise();
        },

        isOpened: function () {
            return this.opened || false;
        },
    });
});