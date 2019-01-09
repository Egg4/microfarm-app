'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/popup/popup',
    'lib/widget/list/list',
    'lib/widget/list/item/item',
    'lib/widget/html/html',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Popup, List, ListItem, Html, Button, Label, Icon) {

    return Popup.extend({

        initialize: function (options) {
            var defaults = {
                errors: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Popup.prototype.initialize.call(this, $.extend(true, {
                id: 'error-popup',
                icon: new Icon({name: 'exclamation-triangle'}),
                body: this.buildList(),
                buttons: [
                    this.buildCloseButton(),
                ],
            }, options));
        },

        buildList: function () {
            return new List({
                items: function () {
                    return _.map(this.errors, function(error) {
                        return this.buildListItem(error);
                    }.bind(this));
                }.bind(this),
            });
        },

        buildListItem: function (error) {
            return new ListItem({
                content: new Html({
                    template: '<%- name %>: <%- description %>',
                    data: error,
                }),
            });
        },

        buildCloseButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('error-popup.button.close'),
                    icon: new Icon({name: 'check'}),
                }),
                theme: 'b',
                events: {
                    click: function () {
                        this.close().done(function() {
                            this.deferred.resolve();
                        }.bind(this));
                    }.bind(this),
                },
            });
        },

        open: function () {
            this.deferred = $.Deferred();
            Popup.prototype.open.call(this);
            return this.deferred.promise();
        },
    });
});