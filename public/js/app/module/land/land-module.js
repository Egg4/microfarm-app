'use strict';

define([
    'jquery',
    'underscore',
    'lib/module/module',
    'app/module/land/schema/bed-schema',
    'app/module/land/schema/block-schema',
    'app/module/land/schema/crop_location-schema',
    'app/module/land/schema/zone-schema',
    'app/module/land/schema/zones-schema',
], function ($, _, Module,
             BedSchema,
             BlockSchema,
             CropLocationSchema,
             ZoneSchema,
             ZonesSchema
) {
    return Module.extend({

        initialize: function () {
            Module.prototype.initialize.call(this, {
                dependencies: ['core'],
                schemas: {
                    bed: new BedSchema(),
                    block: new BlockSchema(),
                    crop_location: new CropLocationSchema(),
                    zone: new ZoneSchema(),
                    zones: new ZonesSchema(),
                },
            });
        },
    });
});