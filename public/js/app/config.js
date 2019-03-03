'use strict';

define([
    'jquery',
], function ($) {
    var config = {
        env: env,
        api: {
            url: apiUrl,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 25000,
        },
        demo: {
            email: 'demo.user@maraichage.org',
            password: 'tAe1DSEXKCKskaHf',
        },
        account: {
            basic: [
                'taxonomy',
                'land',
                'basic-production',
            ],
            demo: [
                'taxonomy',
                'land',
                'basic-production',
                'trade',
            ],
            advanced: [
                'access',
                'taxonomy',
                'land',
                'basic-production',
                'post-production',
                'extra-production',
                'trade',
            ],
        },
    };

    if (env !== 'dev') {
        config.api.headers['Content-Encoding'] = 'gzip';
    }

    return config;
});