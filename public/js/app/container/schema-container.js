'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/schema/article-schema',
    'app/schema/articles-schema',
    'app/schema/authentication-schema',
    'app/schema/category-schema',
    'app/schema/entity-schema',
    'app/schema/family-schema',
    'app/schema/genus-schema',
    'app/schema/login-schema',
    'app/schema/organization-schema',
    'app/schema/organizations-schema',
    'app/schema/plant-schema',
    'app/schema/role-schema',
    'app/schema/species-schema',
    'app/schema/user_role-schema',
    'app/schema/varieties-schema',
    'app/schema/variety-schema',
], function ($, _, Container,
             ArticleSchema,
             ArticlesSchema,
             AuthenticationSchema,
             CategorySchema,
             EntitySchema,
             FamilySchema,
             GenusSchema,
             LoginSchema,
             OrganizationSchema,
             OrganizationsSchema,
             PlantSchema,
             RoleSchema,
             SpeciesSchema,
             UserRoleSchema,
             VarietiesSchema,
             VarietySchema
) {

    return Container.extend({

        initialize: function () {
            Container.prototype.initialize.call(this, {
                article: new ArticleSchema(),
                articles: new ArticlesSchema(),
                authentication: new AuthenticationSchema(),
                category: new CategorySchema(),
                entity: new EntitySchema(),
                family: new FamilySchema(),
                genus: new GenusSchema(),
                login: new LoginSchema(),
                organization: new OrganizationSchema(),
                organizations: new OrganizationsSchema(),
                plant: new PlantSchema(),
                role: new RoleSchema(),
                species: new SpeciesSchema(),
                user_role: new UserRoleSchema(),
                varieties: new VarietiesSchema(),
                variety: new VarietySchema(),
            });
        },
    });
});