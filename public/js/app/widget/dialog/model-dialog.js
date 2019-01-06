'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/dialog/dialog',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Dialog, Button, Label, Icon) {

    return Dialog.extend({

        initialize: function (options) {
            var defaults = {
                form: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            this.cancelButton = new Button({
                label: new Label({
                    text: polyglot.t('model-dialog.button.cancel'),
                    icon: new Icon({name: 'times'}),
                }),
                events: {
                    click: this.hide.bind(this),
                },
            });

            this.saveButton = new Button({
                label: new Label({
                    text: polyglot.t('model-dialog.button.save'),
                    icon: new Icon({name: 'check'}),
                }),
                theme: 'b',
                events: {
                    click: this.save.bind(this),
                },
            });

            Dialog.prototype.initialize.call(this, $.extend(true, {
                content: this.form,
                buttons: [
                    this.cancelButton,
                    this.saveButton,
                ],
            }, options));
        },

        save: function() {
            this.cancelButton.state = 'disabled';
            this.saveButton.state = 'disabled';
            this.cancelButton.render();
            this.saveButton.render();
            app.loader.show();

            this.form.submit()
                .done(function() {
                    this.hide();
                }.bind(this))
                .always(function() {
                    this.cancelButton.state = 'enabled';
                    this.saveButton.state = 'enabled';
                    this.cancelButton.render();
                    this.saveButton.render();
                    app.loader.hide();
                }.bind(this));
        },
    });
});