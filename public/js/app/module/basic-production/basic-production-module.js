'use strict';

define([
    'jquery',
    'underscore',
    'lib/module/module',
    'app/module/basic-production/schema/article-schema',
    'app/module/basic-production/schema/articles-schema',
    'app/module/basic-production/schema/crop-schema',
    'app/module/basic-production/schema/crops-schema',
    'app/module/basic-production/schema/output-schema',
    'app/module/basic-production/schema/outputs-schema',
    'app/module/basic-production/schema/planner-schema',
    'app/module/basic-production/schema/planting-schema',
    'app/module/basic-production/schema/seedling-schema',
    'app/module/basic-production/schema/task-schema',
    'app/module/basic-production/schema/working-schema',
], function ($, _, Module,
             ArticleSchema,
             ArticlesSchema,
             CropSchema,
             CropsSchema,
             OutputSchema,
             OutputsSchema,
             PlannerSchema,
             PlantingSchema,
             SeedlingSchema,
             TaskSchema,
             WorkingSchema
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                dependencies: ['core', 'taxonomy'],
                schemas: {
                    article: new ArticleSchema(),
                    articles: new ArticlesSchema(),
                    crop: new CropSchema(),
                    crops: new CropsSchema(),
                    output: new OutputSchema(),
                    outputs: new OutputsSchema(),
                    planner: new PlannerSchema(),
                    planting: new PlantingSchema(),
                    seedling: new SeedlingSchema(),
                    task: new TaskSchema(),
                    working: new WorkingSchema(),
                },
            });
        },
    });
});