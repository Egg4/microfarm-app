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
            timeout: 10000,
        },
    };

    if (env !== 'dev') {
        config.api.headers['Content-Encoding'] = 'gzip';
    }

    return config;
});