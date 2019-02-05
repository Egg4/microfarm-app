'use strict';

define([
    'jquery',
    'underscore',
    'lib/container/container',
    'app/module/access/access-module',
    'app/module/basic-production/basic-production-module',
    'app/module/core/core-module',
    'app/module/land/land-module',
    'app/module/post-production/post-production-module',
    'app/module/taxonomy/taxonomy-module',
], function ($, _, Container,
             AccessModule,
             BasicProductionModule,
             CoreModule,
             LandModule,
             PostProductionModule,
             TaxonomyModule
) {
    return Container.extend({

        initialize: function () {
            Container.prototype.initialize.call(this);
            this.schemas = new Container();

            var modules = {
                'core': new CoreModule(),
                'access': new AccessModule(),
                'taxonomy': new TaxonomyModule(),
                'basic-production': new BasicProductionModule(),
                'post-production': new PostProductionModule(),
                'land': new LandModule(),
            };

            _.each(modules, function (module, name) {
                this.set(name, module);
            }.bind(this));
        },

        set: function (name, module) {
            Container.prototype.set.call(this, name, module);
            this.checkModuleDependencies(name, module);
            this.registerModuleSchemas(module.schemas);
        },

        checkModuleDependencies: function (name, module) {
            _.each(module.dependencies, function (depName) {
                if (!this.has(depName)) {
                    throw new Error('Module "' + name + '" require module "' + depName + '"');
                }
            }.bind(this));
        },

        registerModuleSchemas: function (schemas) {
            _.each(schemas, function (schema, key) {
                if (this.schemas.has(key)) {
                    throw new Error('Schema "' + key + '" already set');
                }
                this.schemas.set(key, schema);
            }.bind(this));
        },
    });
});