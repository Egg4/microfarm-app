'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/schema/login-schema',
    'app/schema/authentication-schema',
    'app/schema/entity-schema',
    'app/schema/user_role-schema',
    'app/schema/role-schema',
    'app/schema/organization-schema',
    'app/schema/category-schema',
    'app/schema/article-schema',
], function ($, _, Container,
             LoginSchema,
             AuthenticationSchema,
             EntitySchema,
             UserRoleSchema,
             RoleSchema,
             OrganizationSchema,
             CategorySchema,
             ArticleSchema
) {

    return Container.extend({

        initialize: function () {
            Container.prototype.initialize.call(this, {
                login: new LoginSchema(),
                authentication: new AuthenticationSchema(),
                entity: new EntitySchema(),
                user_role: new UserRoleSchema(),
                role: new RoleSchema(),
                organization: new OrganizationSchema(),
                category: new CategorySchema(),
                article: new ArticleSchema(),
            });
        },
    });
});