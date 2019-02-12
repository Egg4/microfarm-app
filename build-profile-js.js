({
    baseUrl: './public/js',
    name: 'bootstrap',
    include: 'requireLib',
    out: './public/build/app-min.js',
    paths: {
        'requireLib': '../vendor/js/require-2.3.6.min',
        'jquery': '../vendor/js/jquery-1.12.4.min',
        'jquery.mobile': '../vendor/js/jquery.mobile-1.4.5.min',
        'jquery.datepicker': '../vendor/js/jquery.datepicker-min',
        'underscore': '../vendor/js/underscore-1.9.1.min',
        'backbone': '../vendor/js/backbone-1.3.3.min',
        'pako': '../vendor/js/pako-1.0.8.min',
        'polyglot': '../vendor/js/polyglot-min',
    },
})