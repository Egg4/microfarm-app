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
        'jquery': '../vendor/js/jquery-1.12.4',
        'jquery.mobile': '../vendor/js/jquery.mobile-1.4.5',
        'jquery.datepicker': '../vendor/js/jquery.datepicker',
        'underscore': '../vendor/js/underscore-1.9.1',
        'backbone': '../vendor/js/backbone-1.3.3',
        'pako': '../vendor/js/pako-1.0.8.min',
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