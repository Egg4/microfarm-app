({
    baseUrl: './public/js',
    name: 'bootstrap',
    include: 'requireLib',
    out: './public/build/app-min.js',
    //optimize: 'none',
    paths: {
        'requireLib': '../vendor/js/require-min',
        'jquery': '../vendor/js/jquery-min',
        'jquery.mobile': '../vendor/js/jquery.mobile-min',
        'jquery.datepicker': '../vendor/js/jquery.datepicker-min',
        'underscore': '../vendor/js/underscore-min',
        'backbone': '../vendor/js/backbone-min',
        'pako': '../vendor/js/pako-min',
        'polyglot': '../vendor/js/polyglot-min',
    },
})