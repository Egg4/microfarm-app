'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/popup/popup',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Popup, Html, Button, Label, Icon) {

    return Popup.extend({

        initialize: function (options) {
            var defaults = {
                message: '',
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Popup.prototype.initialize.call(this, $.extend(true, {
                id: 'confirm-popup',
                icon: new Icon({name: 'question-circle'}),
                body: this.buildBody(),
                buttons: [
                    this.buildNoButton(),
                    this.buildYesButton(),
                ],
            }, options));
        },

        buildBody: function () {
            return new Html({
                template: '<%= message %>',
                data: function () {
                    return {
                        message: this.message
                    };
                }.bind(this),
            });
        },

        buildNoButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('confirm-popup.button.no'),
                    icon: new Icon({name: 'times'}),
                }),
                events: {
                    click: this.onNo.bind(this),
                },
            });
        },

        buildYesButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('confirm-popup.button.yes'),
                    icon: new Icon({name: 'check'}),
                }),
                theme: 'b',
                events: {
                    click: this.onYes.bind(this),
                },
            });
        },

        open: function () {
            this.deferred = $.Deferred();
            Popup.prototype.open.call(this);
            return this.deferred.promise();
        },

        onNo: function () {
            this.close().done(function() {
                this.deferred.reject();
            }.bind(this));
        },

        onYes: function () {
            this.close().done(function() {
                this.deferred.resolve();
            }.bind(this));
        },
    });
});