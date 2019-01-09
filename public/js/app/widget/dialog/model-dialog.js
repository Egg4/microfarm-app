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

            Dialog.prototype.initialize.call(this, $.extend(true, {
                body: this.form,
                buttons: [
                    this.buildCancelButton(),
                    this.buildSaveButton(),
                ],
            }, options));

            $(this.el).addClass('model-dialog');
        },

        buildCancelButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model-dialog.button.cancel'),
                    icon: new Icon({name: 'times'}),
                }),
                events: {
                    click: this.close.bind(this),
                },
            });
        },

        buildSaveButton: function () {
            return new Button({
                label: new Label({
                    text: polyglot.t('model-dialog.button.save'),
                    icon: new Icon({name: 'check'}),
                }),
                theme: 'b',
                events: {
                    click: this.save.bind(this),
                },
            });
        },

        save: function() {
            var cancelButton = this.buttons[0],
                saveButton = this.buttons[1];

            cancelButton.state = 'disabled';
            saveButton.state = 'disabled';
            cancelButton.render();
            saveButton.render();
            app.loader.show();

            this.form.submit()
                .done(function(data) {
                    this.close();
                }.bind(this))
                .always(function() {
                    cancelButton.state = 'enabled';
                    saveButton.state = 'enabled';
                    cancelButton.render();
                    saveButton.render();
                    app.loader.hide();
                });
        },
    });
});