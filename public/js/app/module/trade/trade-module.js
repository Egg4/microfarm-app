'use strict';

define([
    'jquery',
    'underscore',
    'lib/module/module',
    'app/module/trade/schema/organization-schema',
    'app/module/trade/schema/organizations-schema',
], function ($, _, Module,
             OrganizationSchema,
             OrganizationsSchema
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                dependencies: ['core', 'basic-production'],
                schemas: {
                    organization: new OrganizationSchema(),
                    organizations: new OrganizationsSchema(),
                },
            });
        },
    });
});