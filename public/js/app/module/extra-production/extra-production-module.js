'use strict';

define([
    'jquery',
    'underscore',
    'lib/module/module',
    'app/module/extra-production/schema/camera-schema',
    'app/module/extra-production/schema/photo-schema',
    'app/module/extra-production/schema/stage-schema',
], function ($, _, Module,
             CameraSchema,
             PhotoSchema,
             StageSchema
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                dependencies: ['core', 'basic-production'],
                schemas: {
                    camera: new CameraSchema(),
                    photo: new PhotoSchema(),
                    stage: new StageSchema(),
                },
            });
        },
    });
});