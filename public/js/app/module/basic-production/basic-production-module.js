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
    'app/module/basic-production/schema/seeding-schema',
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
             SeedingSchema,
             TaskSchema,
             WorkingSchema
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                dependencies: ['core'],
                schemas: {
                    article: new ArticleSchema(),
                    articles: new ArticlesSchema(),
                    crop: new CropSchema(),
                    crops: new CropsSchema(),
                    output: new OutputSchema(),
                    outputs: new OutputsSchema(),
                    planner: new PlannerSchema(),
                    seeding: new SeedingSchema(),
                    task: new TaskSchema(),
                    working: new WorkingSchema(),
                },
            });
        },
    });
});