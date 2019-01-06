'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/widget',
], function ($, _, Widget) {

    return Widget.extend({
        tagName: 'div',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            $.extend(true, this, {
                position: 'left',
                positionFixed: true,
                fullscreen: false,
                display: 'reveal',
                dismissible: false,
                animate: false,
                swipeClose: false,
                theme: 'a',
                header: false,
                body: false,
                footer: false,
            }, _.pick(options, 'position', 'positionFixed', 'fullscreen', 'display', 'dismissible', 'animate', 'swipeClose', 'theme', 'header', 'body', 'footer'));

            $(this.el).addClass('panel-widget');
            if (this.fullscreen) {
                $(this.el).addClass('panel-widget-fullscreen');
            }

            if (this.header) {
                $(this.el).append(this.header.el);
            }
            if (this.body) {
                $(this.el).append(this.body.el);
            }
            if (this.footer) {
                $(this.el).append(this.footer.el);
            }

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
                    if (this.deferredClose) {
                        this.deferredClose.resolve();
                    }
                }.bind(this),
            });
        },

        show: function () {
            this.render();
            this.open();
        },

        open: function () {
            this.deferredOpen = $.Deferred();
            $(this.el).panel('open').enhanceWithin();
            return this.deferredOpen.promise();
        },

        close: function () {
            this.deferredClose = $.Deferred();
            $(this.el).panel('close');
            return this.deferredClose.promise();
        },
    });
});