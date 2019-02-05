'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.Router.extend({
        routes: {
            '': 'home',
            'activate/:key': 'activate',
        },
        defaultRoute: 'planner',

        start: function () {
            if (app.authentication.isEntitySelected()) {
                app.collections.fetchAll().done(function() {
                    Backbone.history.start();
                }.bind(this));
            }
            else {
                Backbone.history.start();
            }
        },

        execute: function(callback, args, name) {
            if (!_.contains(['login', 'signup', 'activate'], name) && !app.authentication.isUserLogged()) {
                this.navigate('login');
                return false;
            }
            if (name != 'authentication' && app.authentication.isUserLogged() && !app.authentication.isEntitySelected()) {
                this.navigate('authentication');
                return false;
            }
            if (name == 'login' && app.authentication.isUserLogged()) {
                this.navigate();
                return false;
            }
            if (_.contains(['login', 'signup', 'activate', 'authentication'], name)
                || app.collections.fetched()) {
                if (app.pages.has(name)) {
                    var page = app.pages.get(name);
                    if (page[callback]) page[callback].apply(page, args);
                    page.render();
                    this.changePage(page);
                } else {
                    if (callback) callback.apply(this, args);
                }
            }
            else {
                this.navigate();
            }
        },

        navigate: function (hash) {
            hash = hash || '';
            window.location = '/#'+ hash;
        },

        back: function () {
            window.history.back();
        },

        home: function () {
            if (app.collections.fetched()) {
                this.navigate(this.defaultRoute);
            }
        },

        activate: function (key) {
            app.authentication.activate(key).done(function () {
                this.navigate();
            }.bind(this));
        },

        changePage: function (page) {
            $.mobile.changePage($(page.el) , {
                reverse: false,
                changeHash: false,
                transition: 'none',
            });
            window.scrollTo(0, 0);
        }
    });
});