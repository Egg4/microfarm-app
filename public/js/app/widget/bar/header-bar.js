'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/bar/bar',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Bar, Button, Label, Icon) {

    return Bar.extend({

        initialize: function (options) {
            var defaults = {
                title: '',
                icon: false,
                back: false,
                menu: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            var leftButtons = [];
            if (this.back) {
                leftButtons.push(
                    new Button({
                        label: new Label({
                            icon: new Icon({
                                name: 'long-arrow-alt-left',
                            }),
                        }),
                        events: {
                            click: function() {
                                app.router.back();
                            },
                        },
                    })
                );
            }

            var rightButtons = [];
            if (this.menu) {
                rightButtons.push(
                    new Button({
                        label: new Label({
                            icon: new Icon({
                                name: 'ellipsis-v',
                            }),
                        }),
                        events: {
                            click: function() {
                                this.menu.show();
                            }.bind(this),
                        },
                    })
                );
            }

            Bar.prototype.initialize.call(this, $.extend(true, {
                role: 'header',
                position: 'fixed',
                leftButtons: leftButtons,
                label: new Label({
                    className: 'ui-title',
                    text: this.title,
                    icon: this.icon,
                }),
                rightButtons: rightButtons,
            }, options));
        },
    });
});