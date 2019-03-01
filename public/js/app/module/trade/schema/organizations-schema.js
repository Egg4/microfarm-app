'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'app/module/trade/page/organizations-page',
], function ($, _, Schema, Page) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                page: {
                    class: Page,
                    routes: [{
                        pattern: 'suppliers',
                        callback: 'setSuppliersData',
                    }, {
                        pattern: 'clients',
                        callback: 'setClientsData',
                    }],
                },
            });
        },
    });
});