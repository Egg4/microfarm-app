'use strict';

define([
    'jquery',
    'underscore',
    'lib/module/module',
    'app/module/basic-production/schema/article-schema',
    'app/module/basic-production/schema/articles-schema',
    'app/module/basic-production/schema/calendar-schema',
    'app/module/basic-production/schema/crop-schema',
    'app/module/basic-production/schema/crops-schema',
    'app/module/basic-production/schema/output-schema',
    'app/module/basic-production/schema/planner-schema',
    'app/module/basic-production/schema/planting-schema',
    'app/module/basic-production/schema/seedling-schema',
    'app/module/basic-production/schema/task-schema',
    'app/module/basic-production/schema/transplanting-schema',
    'app/module/basic-production/schema/working-schema',
], function ($, _, Module,
             ArticleSchema,
             ArticlesSchema,
             CalendarSchema,
             CropSchema,
             CropsSchema,
             OutputSchema,
             PlannerSchema,
             PlantingSchema,
             SeedlingSchema,
             TaskSchema,
             TransplantingSchema,
             WorkingSchema
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                dependencies: ['core', 'taxonomy'],
                schemas: {
                    article: new ArticleSchema(),
                    articles: new ArticlesSchema(),
                    calendar: new CalendarSchema(),
                    crop: new CropSchema(),
                    crops: new CropsSchema(),
                    output: new OutputSchema(),
                    planner: new PlannerSchema(),
                    planting: new PlantingSchema(),
                    seedling: new SeedlingSchema(),
                    task: new TaskSchema(),
                    transplanting: new TransplantingSchema(),
                    working: new WorkingSchema(),
                },
            });
        },
    });
});