'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/page/page',
    'app/widget/bar/header-bar',
    'lib/widget/layout/stack-layout',
    'lib/widget/navigation/navigation',
    'lib/widget/layout/grid-layout',
    'app/module/core/form/signup-form',
    'lib/widget/button/button',
    'lib/widget/label/label',
    'lib/widget/icon/fa-icon',
], function ($, _, Page, Header, StackLayout, Navigation, GridLayout, Form, Button, Label, Icon) {

    return Page.extend({

        initialize: function () {
            Page.prototype.initialize.call(this, {
                id: 'signup-page',
                header: new Header({
                    title: polyglot.t('signup-page.title'),
                    icon: new Icon({name: 'user-plus'}),
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
                            this.buildSignupButton(),
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
                        this.buildLoginButton(),
                    ],
                }),
            });
        },

        buildLoginButton: function() {
            return new Button({
                label: new Label({
                    text: polyglot.t('login-page.button.login'),
                    icon: new Icon({name: 'sign-in-alt'}),
                }),
                iconAlign: 'top',
                events: {
                    click: function () {
                        app.router.navigate('login');
                    },
                },
            });
        },

        /*---------------------------------------- Form ------------------------------------------*/
        buildForm: function () {
            return new Form();
        },

        buildSignupButton: function() {
            return new Button({
                label: new Label({
                    text: polyglot.t('login-page.button.signup'),
                    icon: new Icon({name: 'user-plus'}),
                }),
                iconAlign: 'right',
                theme: 'b',
                events: {
                    click: this.signup.bind(this),
                },
            });
        },

        signup: function() {
            var bodyLayout = this.body.items[1],
                signupForm = bodyLayout.items[0],
                signupButton = bodyLayout.items[1];

            signupButton.state = 'disabled';
            signupButton.render();
            app.loader.show();

            signupForm.submit()
                .done(function() {
                    app.router.navigate('login');
                })
                .always(function() {
                    signupButton.state = 'enabled';
                    signupButton.render();
                    app.loader.hide();
                });
        },

        render: function () {
            var bodyLayout = this.body.items[1],
                signupForm = bodyLayout.items[0];
            signupForm.setData({});

            Page.prototype.render.call(this);
        },
    });
});