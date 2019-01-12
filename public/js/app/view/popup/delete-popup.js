'use strict';

define([
    'jquery',
    'underscore',
    'app/view/popup/confirm-popup',
    'lib/widget/layout/stack-layout',
    'lib/widget/html/html',
    'lib/widget/form/form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/checkbox-form-element',
    'lib/widget/form/label/form-label',
    'lib/widget/icon/fa-icon',
], function ($, _, Popup, StackLayout, Html, Form, FormGroup, Checkbox, FormLabel, Icon) {

    return Popup.extend({

        initialize: function (options) {
            var defaults = {
                model: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            Popup.prototype.initialize.call(this, $.extend(true, {
                id: 'delete-popup',
                title: function () {
                    return this.model.getDisplayName();
                }.bind(this),
                icon: new Icon({name: 'trash-alt'}),
                body: this.buildBody(),
            }, options));
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildHtml(),
                    this.buildFrom(),
                ],
            });
        },

        buildHtml: function () {
            return new Html({
                template: '<%= message %>',
            });
        },

        buildFrom: function () {
            return new Form({
                formGroup: new FormGroup({
                    items: [
                        new Checkbox({
                            name: 'confirm',
                            label: new FormLabel({
                                text: polyglot.t('delete-popup.checkbox.label'),
                            }),
                            cast: 'boolean',
                        }),
                    ],
                }),
            });
        },

        getHtml: function () {
            return this.body.items[0];
        },

        getForm: function () {
            return this.body.items[1];
        },

        render: function () {
            var html = this.getHtml(),
                form = this.getForm();
            html.data = {
                message: polyglot.t('delete-popup.body.message', {
                    name: this.model.getDisplayName(),
                }),
            };
            form.setData({
                confirm: false,
            });
            Popup.prototype.render.call(this);
        },

        onYes: function () {
            var form = this.getForm(),
                confirm = form.getElement('confirm').getValue();

            if (confirm) {
                app.loader.show();
                var promises = [
                    this.close(),
                    this.deleteModel(),
                ];
                $.when.apply($, promises)
                    .done(function() {
                        this.deferred.resolve();
                    }.bind(this))
                    .fail(function() {
                        this.deferred.reject();
                    }.bind(this))
                    .always(function() {
                        app.loader.hide();
                    });
            }
        },

        deleteModel: function() {
            var deferred = $.Deferred();
            this.model.destroy({
                success: deferred.resolve,
                error: deferred.reject,
            });
            return deferred.promise();
        },
    });
});