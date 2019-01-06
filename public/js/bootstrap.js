'use strict';

require.config({
    shim: {
        'jquery.mobile': {
            deps: ['jquery'],
        },
        'jquery.datepicker': {
            deps: ['jquery'],
        },
        'jquery.mobile.datepicker': {
            deps: ['jquery.mobile', 'jquery.datepicker'],
        },
        'underscore': {
            exports: '_',
        },
        'backbone': {
            deps: ['underscore', 'jquery'],
            exports: 'Backbone',
        },
        'polyglot': {
            deps: ['underscore'],
            exports: 'Polyglot',
        },
        /*
        'jspdf': {
            exports: 'jsPDF',
        },
        */
    },
    paths: {
        'jquery': '../vendor/js/jquery-min',
        'jquery.mobile': '../vendor/js/jquery.mobile-min',
        'jquery.datepicker': '../vendor/js/jquery.datepicker',
        'jquery.mobile.datepicker': '../vendor/js/jquery.mobile.datepicker',
        'underscore': '../vendor/js/underscore-min',
        'backbone': '../vendor/js/backbone-min',
        'pako': '../vendor/js/pako-min',
        'polyglot': '../vendor/js/polyglot',
        //'jspdf': '../vendor/js/jspdf-min',
    },
});

require([
    'jquery',
    'underscore',
    'backbone',
    'app/app',
    'app/polyglot/fr',
    'lib/common',
    'polyglot',
], function ($, _, Backbone, App, polyglotFr) {

    window.polyglot = new Polyglot({phrases: polyglotFr});

    $(document).on('mobileinit', function () {
        // Disable Jquery mobile links for the benefit of Backbone router
        $.mobile.linkBindingEnabled = false;
        $.mobile.hashListeningEnabled = false;
        $.event.special.tap.emitTapOnTaphold = true;
        $.event.special.tap.tapholdThreshold = 400;
        // Modify Jquery mobile
        $.mobile.filterable.prototype.setInput = function(selector) {
            this._setInput(selector);
        };
    });

    $('#home-page').on('pageinit', function () {
        new App().run();
    });

    require(['jquery.mobile', 'jquery.mobile.datepicker']);
});