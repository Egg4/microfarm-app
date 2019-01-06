({
    baseUrl: './public/js',
    name: 'bootstrap',
    out: './public/build/bootstrap-built.js',
    //optimize: 'none',
    paths: {
        'jquery': '../vendor/js/jquery-min',
        'jquery.mobile': '../vendor/js/jquery.mobile-min',
        'jquery.datepicker': '../vendor/js/jquery.datepicker',
        'jquery.mobile.datepicker': '../vendor/js/jquery.mobile.datepicker',
        'underscore': '../vendor/js/underscore-min',
        'backbone': '../vendor/js/backbone-min',
        'pako': '../vendor/js/pako-min',
        'polyglot': '../vendor/js/polyglot',
        'jspdf': '../vendor/js/jspdf-min',
    },
})