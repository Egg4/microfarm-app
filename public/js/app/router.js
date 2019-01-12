'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.Router.extend({
        routes: {
            '': 'home',
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
            if (_.contains(['login', 'authentication'], name) || app.collections.fetched()) {
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