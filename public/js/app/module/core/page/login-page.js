'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'lib/widget/layout/stack-layout',
    'app/module/core/form/login-form',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, StackLayout, Form, Button, Label, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'login-page',
                header: new Header({
                    title: polyglot.t('login-page.title'),
                    icon: new Icon({name: 'lock'}),
                }),
                body: new StackLayout({
                    className: 'body',
                    items: [
                        new Form(),
                        this.buildLoginButton(),
                    ],
                }),
            });
        },

        buildLoginButton: function() {
            return new Button({
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
        },

        login: function() {
            var loginForm = this.body.items[0],
                loginButton = this.body.items[1];

            loginButton.state = 'disabled';
            loginButton.render();
            app.loader.show();

            loginForm.submit()
                .done(function(data) {
                    app.authentication.set(data.key, data);
                    app.router.navigate('authentication');
                })
                .always(function() {
                    loginButton.state = 'enabled';
                    loginButton.render();
                    app.loader.hide();
                }.bind(this));
        },
    });
});