'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/widget',
    'view/widget/bar/header-bar',
    'view/widget/bar/grid-bar',
], function ($, _, Widget, Header, GridBar) {

    return Widget.extend({
        tagName: 'div',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            $.extend(true, this, {
                header: new Header({title: options.title || 'Title'}),
                body: false,
                buttonBar: new GridBar({items: options.buttons || {}}),
                footer: false,
                theme: 'a',
                overlayTheme: 'b',
                transition: 'pop',
                positionTo: 'windows',
                shadow: true,
                opened: false,
            }, _.pick(options, 'header', 'body', 'buttonBar', 'footer', 'theme', 'overlayTheme', 'transition', 'positionTo', 'shadow'));

            $(this.el).addClass('dialog-widget');

            if (this.header) {
                $(this.el).append(this.header.el);
            }
            if (this.body) {
                $(this.el).append(this.body.el);
            }
            if (this.buttonBar) {
                $(this.el).append(this.buttonBar.el);
            }
            if (this.footer) {
                $(this.el).append(this.footer.el);
            }

            $('body').append(this.el);

            $(this.el).popup({
                theme: this.theme,
                overlayTheme: this.overlayTheme,
                transition: this.transition,
                positionTo: this.positionTo,
                shadow: this.shadow,
                dismissible: false,
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

        render: function (options) {
            Widget.prototype.render.call(this, options);

            options = options || {};
            if (this.header && options.title) {
                this.header.render({
                    title: options.title,
                });
            }
        },

        open: function () {
            this.opened = true;
            this.deferredOpen = $.Deferred();
            $(this.el).popup('open').enhanceWithin();
            return this.deferredOpen.promise();
        },

        close: function () {
            this.deferredClose = $.Deferred();
            $(this.el).popup('close');
            return this.deferredClose.promise();
        },

        isOpened: function () {
            return this.opened;
        },
    });
});