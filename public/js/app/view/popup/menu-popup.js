'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/popup/menu-popup',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Popup, Button, Label, Icon) {

    return Popup.extend({

        initialize: function (options) {
            var defaults = {
                edit: true,
                delete: true,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Popup.prototype.initialize.call(this, $.extend(true, {
                id: 'menu-popup',
                items: this.buildItems.bind(this),
            }, options));
        },

        buildItems: function () {
            var items = [];
            if (this.edit) {
                items.push(this.buildEditButton());
            }
            if (this.delete) {
                items.push(this.buildDeleteButton());
            }
            return items;
        },

        buildEditButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('menu-popup.button.edit'),
                    icon: new Icon({name: 'pencil-alt'}),
                }),
                events: {
                    click: function () {
                        this.onClick('edit');
                    }.bind(this),
                },
            });
        },

        buildDeleteButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('menu-popup.button.delete'),
                    icon: new Icon({name: 'trash-alt'}),
                }),
                events: {
                    click: function () {
                        this.onClick('delete');
                    }.bind(this),
                },
            });
        },

        open: function () {
            this.deferred = $.Deferred();
            Popup.prototype.open.call(this);
            return this.deferred.promise();
        },

        onClick: function (action) {
            this.close().done(function() {
                this.deferred.resolve(action);
            }.bind(this));
        },
    });
});