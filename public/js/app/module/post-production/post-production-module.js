'use strict';

define([
    'jquery',
    'underscore',
    'lib/module/module',
    'app/module/post-production/schema/outputs-schema',
], function ($, _, Module,
             OutputsSchema
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                dependencies: ['basic-production'],
                schemas: {
                    outputs: new OutputsSchema(),
                },
            });
        },
    });
});