'use strict';

define([
    'jquery',
    'jquery.datepicker',
], function ($) {
    var config = {
        env: env,
        api: {
            url: (env == 'prod') ? 'https://api.microfarm.fr/v1.0' : 'https://api.microfarm.local/v1.0',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                //'Content-Encoding': 'gzip',
            },
            timeout: 10000,
        },
        authorization: {
            family: {view: '*'},
            genus: {view: '*'},
            species: {view: '*'},
            category: {view: '*'},
            variety: {view: '*', add: '*', edit: '*', delete: '*'},
            organization: {view: '*', add: '*', edit: '*', delete: '*'},
            article: {view: '*', add: '*', edit: '*', delete: '*'},
            article_category: {view: '*', add: '*', edit: '*', delete: '*'},
            article_plant: {view: '*', add: '*', edit: '*', delete: '*'},
            garden: {view: '*', add: 'admin', edit: 'admin', delete: 'admin'},
            block: {view: '*', add: 'admin', edit: 'admin', delete: 'admin'},
            bed: {view: '*', add: 'admin', edit: 'admin', delete: 'admin'},
            implantation: {view: '*', add: 'admin', edit: 'admin', delete: 'admin'},
            crop: {view: '*', add: 'admin', edit: 'admin', delete: 'admin'},
            snapshot: {view: '*', add: 'admin', edit: 'admin', delete: 'admin'},
            task: {view: '*', add: 'admin', edit: 'admin', delete: 'admin'},
            work: {view: '*', add: '*', edit: '*', delete: '*'},
            flow: {view: '*', add: '*', edit: '*', delete: '*'},
            photo: {view: '*', add: '*', edit: '*', delete: '*'},
            product: {view: '*', add: 'admin', edit: 'admin', delete: 'admin'},
            provider: {view: '*', add: 'admin', edit: 'admin', delete: 'admin'},
            pos: {view: '*', add: 'admin', edit: 'admin', delete: 'admin'},
        },
        refresh: {
            delay: 900000, // 15 minutes
        },
    };

    return config;
});