'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/widget',
    'view/widget/bar/header-bar',
], function ($, _, Widget, Header) {

    return Widget.extend({
        tagName: 'div',

        initialize: function (options) {
            Widget.prototype.initialize.call(this, options);

            $.extend(true, this, {
                header: new Header({title: options.title || ''}),
                items: {},
                footer: false,
                theme: 'a',
                overlayTheme: 'b',
                transition: 'none',
                positionTo: 'windows',
                shadow: true,
            }, _.pick(options, 'header', 'items', 'footer', 'theme', 'overlayTheme', 'transition', 'positionTo', 'shadow'));

            $(this.el).addClass('menu-widget');

            if (this.header) {
                $(this.el).append(this.header.el);
            }
            var ul = $('<ul>');
            _.each(this.items, function(item) {
                var li = $('<li>');
                li.append(item.el);
                ul.append(li);
            }.bind(this));
            $(this.el).append(ul);
            ul.listview();

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
                dismissible: true,
                afteropen: function() {
                    if (this.deferredOpen) {
                        this.deferredOpen.resolve();
                    }
                }.bind(this),
                afterclose: function() {
                    if (this.deferredClose) {
                        this.deferredClose.resolve();
                    }
                }.bind(this),
            });
        },

        show: function (options) {
            this.render(options);
            this.open();
        },

        open: function () {
            this.deferredOpen = $.Deferred();
            $(this.el).popup('open').enhanceWithin();
            return this.deferredOpen.promise();
        },

        close: function () {
            this.deferredClose = $.Deferred();
            $(this.el).popup('close');
            return this.deferredClose.promise();
        },
    });
});