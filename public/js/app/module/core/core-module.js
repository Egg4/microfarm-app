'use strict';

define([
    'jquery',
    'underscore',
    'lib/module/module',
    'app/module/core/schema/authentication-schema',
    'app/module/core/schema/category-schema',
    'app/module/core/schema/entity-schema',
    'app/module/core/schema/login-schema',
    'app/module/core/schema/user_role-schema',
], function ($, _, Module,
             AuthenticationSchema,
             CategorySchema,
             EntitySchema,
             LoginSchema,
             UserRoleSchema
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                schemas: {
                    authentication: new AuthenticationSchema(),
                    category: new CategorySchema(),
                    entity: new EntitySchema(),
                    login: new LoginSchema(),
                    user_role: new UserRoleSchema(),
                },
            });
        },
    });
});