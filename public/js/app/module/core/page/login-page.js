'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'lib/widget/layout/stack-layout',
    'lib/widget/navigation/navigation',
    'lib/widget/layout/grid-layout',
    'app/module/core/form/login-form',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, StackLayout, Navigation, GridLayout, Form, Button, Label, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'login-page',
                header: new Header({
                    title: polyglot.t('login-page.title'),
                    icon: new Icon({name: 'lock'}),
                }),
                body: this.buildBody(),
            });
        },

        buildBody: function () {
            return new StackLayout({
                items: [
                    this.buildNavigation(),
                    new StackLayout({
                        className: 'body',
                        items: [
                            this.buildForm(),
                            this.buildLoginButton(),
                        ],
                    }),
                ],
            });
        },

        /*---------------------------------------- Navigation ------------------------------------------*/
        buildNavigation: function () {
            return new Navigation({
                layout: new GridLayout({
                    column: 1,
                    items: [
                        this.buildDemoButton(),
                        //this.buildSignupButton(),
                    ],
                }),
            });
        },

        buildDemoButton: function() {
            return new Button({
                label: new Label({
                    text: polyglot.t('login-page.button.demo'),
                    icon: new Icon({name: 'dot-circle'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.client.send({
                            method: 'POST',
                            url: '/user/login',
                            data: {
                                email: app.config.demo.email,
                                password: app.config.demo.password,
                            },
                        }).done(function(data) {
                            app.authentication.set(data);
                            app.router.navigate('authentication');
                        });
                    },
                },
            });
        },

        buildSignupButton: function() {
            return new Button({
                label: new Label({
                    text: polyglot.t('login-page.button.signup'),
                    icon: new Icon({name: 'user-plus'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('signup');
                    },
                },
            });
        },

        /*---------------------------------------- Form ------------------------------------------*/
        buildForm: function () {
            return new Form();
        },

        buildLoginButton: function() {
            return new Button({
                label: new Label({
                    text: polyglot.t('login-page.button.login'),
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
            var bodyLayout = this.body.items[1],
                loginForm = bodyLayout.items[0],
                loginButton = bodyLayout.items[1];

            loginButton.state = 'disabled';
            loginButton.render();
            app.loader.show();

            loginForm.submit()
                .done(function(data) {
                    app.authentication.set(data);
                    app.router.navigate('authentication');
                })
                .always(function() {
                    loginButton.state = 'enabled';
                    loginButton.render();
                    app.loader.hide();
                });
        },
    });
});