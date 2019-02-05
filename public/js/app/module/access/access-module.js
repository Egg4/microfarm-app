'use strict';

define([
    'jquery',
    'underscore',
    'lib/module/module',
    'app/module/access/schema/role_access-schema',
], function ($, _, Module,
             RoleAccess
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                dependencies: ['core'],
                schemas: {
                    role_access: new RoleAccess(),
                },
            });
        },
    });
});