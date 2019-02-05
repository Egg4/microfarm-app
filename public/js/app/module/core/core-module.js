'use strict';

define([
    'jquery',
    'underscore',
    'lib/module/module',
    'app/module/core/schema/authentication-schema',
    'app/module/core/schema/category-schema',
    'app/module/core/schema/entity-schema',
    'app/module/core/schema/login-schema',
    'app/module/core/schema/role-schema',
    'app/module/core/schema/roles-schema',
    'app/module/core/schema/signup-schema',
    'app/module/core/schema/user-schema',
    'app/module/core/schema/user_role-schema',
    'app/module/core/schema/users-schema',
], function ($, _, Module,
             AuthenticationSchema,
             CategorySchema,
             EntitySchema,
             LoginSchema,
             RoleSchema,
             RolesSchema,
             SignupSchema,
             UserSchema,
             UserRoleSchema,
             UsersSchema
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                schemas: {
                    authentication: new AuthenticationSchema(),
                    category: new CategorySchema(),
                    entity: new EntitySchema(),
                    login: new LoginSchema(),
                    role: new RoleSchema(),
                    roles: new RolesSchema(),
                    signup: new SignupSchema(),
                    user: new UserSchema(),
                    user_role: new UserRoleSchema(),
                    users: new UsersSchema(),
                },
            });
        },
    });
});