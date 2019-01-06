'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'lib/widget/layout/stack-layout',
    'app/view/form/login-form',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, StackLayout, Form, Button, Label, Icon) {

    return Page.extend({

        initialize: function () {
            this.form = new Form();
            this.button = new Button({
                label: new Label({
                    text: polyglot.t('login-page.button.submit'),
                    icon: new Icon({name: 'sign-in-alt'}),
                }),
                iconAlign: 'right',
                theme: 'b',
                events: {
                    click: this.login.bind(this),
                },
            });

            Page.prototype.initialize.call(this, {
                id: 'login-page',
                header: new Header({
                    title: polyglot.t('login-page.title'),
                    icon: new Icon({name: 'lock'}),
                }),
                body: new StackLayout({
                    items: [
                        this.form,
                        this.button,
                    ],
                }),
            });
        },

        login: function() {
            this.button.state = 'disabled';
            this.button.render();
            app.loader.show();

            this.form.submit()
                .done(function(data) {
                    app.authentication.set(data.key, data);
                    app.router.navigate('authentication');
                })
                .always(function() {
                    this.button.state = 'enabled';
                    this.button.render();
                    app.loader.hide();
                }.bind(this));
        },
    });
});