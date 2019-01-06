'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.Router.extend({
        routes: {
            '': 'home',
            'logout': 'logout',
        },
        defaultRoute: 'entity',

        start: function () {
            Backbone.history.start();
        },

        execute: function(callback, args, name) {
            if (name != 'login' && !app.authentication.isSet()) {
                this.navigate('login');
                return false;
            }
            if (name != 'authentication' && app.authentication.isSet() && _.isNull(app.authentication.getRole())) {
                this.navigate('authentication');
                return false;
            }
            if (name == 'login' && app.authentication.isSet()) {
                this.navigate();
                return false;
            }
            if (_.contains(['login', 'logout', 'authentication'], name) || app.collections.fetched()) {
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

        navigate: function (hash, params) {
            hash = hash || '';
            var location = '/#'+ hash;
            if (params) {
                var searchParams = new URLSearchParams();
                _.each(params, function (value, key) {
                    searchParams.set(key, value);
                });
                location += '?' + searchParams.toString();
            }
            window.location = location;
        },

        back: function () {
            window.history.back();
        },

        home: function () {
            if (app.collections.fetched()) {
                this.navigate(this.defaultRoute);
            }
        },

        logout: function () {
            app.authentication.logout().done(function() {
                app.collections.resetAll();
                this.navigate('login');
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