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
            email: 'demo.user@demo.org',
            password: 'Démo1234',
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
            ],
            advanced: [
                'access',
                'taxonomy',
                'land',
                'basic-production',
                'post-production',
            ],
        },
    };

    if (env !== 'dev') {
        config.api.headers['Content-Encoding'] = 'gzip';
    }

    return config;
});