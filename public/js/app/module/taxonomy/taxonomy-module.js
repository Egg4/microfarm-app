'use strict';

define([
    'jquery',
    'underscore',
    'lib/module/module',
    'app/module/taxonomy/schema/article_variety-schema',
    'app/module/taxonomy/schema/family-schema',
    'app/module/taxonomy/schema/genus-schema',
    'app/module/taxonomy/schema/plant-schema',
    'app/module/taxonomy/schema/species-schema',
    'app/module/taxonomy/schema/varieties-schema',
    'app/module/taxonomy/schema/variety-schema',
], function ($, _, Module,
             ArticleVarietySchema,
             FamilySchema,
             GenusSchema,
             PlantSchema,
             SpeciesSchema,
             VarietiesSchema,
             VarietySchema
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                dependencies: ['core'],
                schemas: {
                    article_variety: new ArticleVarietySchema(),
                    family: new FamilySchema(),
                    genus: new GenusSchema(),
                    plant: new PlantSchema(),
                    species: new SpeciesSchema(),
                    varieties: new VarietiesSchema(),
                    variety: new VarietySchema(),
                },
            });
        },
    });
});