'use strict';

require.config({
    shim: {
        'jquery.mobile': {
            deps: ['jquery'],
        },
        'jquery.datepicker': {
            deps: ['jquery'],
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
    },
    paths: {
        'jquery': '../vendor/js/jquery-min',
        'jquery.mobile': '../vendor/js/jquery.mobile-min',
        'jquery.datepicker': '../vendor/js/jquery.datepicker',
        'underscore': '../vendor/js/underscore-min',
        'backbone': '../vendor/js/backbone-min',
        'pako': '../vendor/js/pako-min',
        'polyglot': '../vendor/js/polyglot',
    },
});

require([
    'jquery',
], function ($) {
    $(document).on('mobileinit', function () {
        // Disable Jquery mobile links for the benefit of Backbone router
        $.mobile.linkBindingEnabled = false;
        $.mobile.hashListeningEnabled = false;
        $.event.special.tap.emitTapOnTaphold = true;
        $.event.special.tap.tapholdThreshold = 300;
    });
});

require([
    'jquery',
    'underscore',
    'backbone',
    'app/app',
    'app/polyglot/fr',
    'lib/common',
    'polyglot',
    'jquery.mobile',
    'jquery.datepicker',
], function ($, _, Backbone, App, polyglotFr) {
    window.polyglot = new Polyglot({phrases: polyglotFr});
    new App().run();
});