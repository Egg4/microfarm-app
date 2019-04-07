'use strict';

define([
    'jquery',
    'underscore',
    'lib/module/module',
    'app/module/advanced-production/schema/tooling-schema',
], function ($, _, Module,
             ToolingSchema
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                dependencies: ['core', 'basic-production'],
                schemas: {
                    tooling: new ToolingSchema(),
                },
            });
        },
    });
});