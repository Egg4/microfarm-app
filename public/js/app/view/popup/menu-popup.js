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
            Popup.prototype.initialize.call(this, $.extend(true, {
                id: 'menu-popup',
                items: [
                    this.buildEditionButton(),
                    this.buildDeletionButton(),
                ],
            }, options));
        },

        buildEditionButton: function () {
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

        buildDeletionButton: function () {
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