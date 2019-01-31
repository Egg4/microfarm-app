'use strict';

define([
    'jquery',
    'underscore',
    'lib/schema/schema',
    'lib/model/model',
    'lib/collection/collection',
    'app/module/land/form/crop_location-form',
    'app/widget/dialog/model-dialog',
], function ($, _, Schema, Model, Collection, Form, Dialog) {

    return Schema.extend({

        initialize: function () {
            Schema.prototype.initialize.call(this, {
                model: {
                    class: Model,
                    displayName: function () {
                        var crop = this.find('crop'),
                            zone = this.find('zone'),
                            block = this.find('block'),
                            bed = this.find('bed'),
                            name = zone.getDisplayName();
                        name += _.isNull(block) ? '' : ' ' + block.getDisplayName();
                        name += _.isNull(bed) ? '' : ' ' + bed.getDisplayName();
                        return crop.getDisplayName() + ' - ' + name;
                    },
                },
                collection: {
                    class: Collection,
                    foreignKeys: {
                        crop_id: {
                            model: 'crop',
                            onDelete: 'cascade',
                        },
                        zone_id: {
                            model: 'zone',
                            onDelete: 'cascade',
                        },
                        block_id: {
                            model: 'block',
                            onDelete: 'set_null',
                        },
                        bed_id: {
                            model: 'bed',
                            onDelete: 'set_null',
                        },
                    },
                    uniqueKey: ['crop_id', 'zone_id', 'block_id', 'bed_id'],
                    comparator: 'id',
                },
                form: {
                    class: Form,
                },
                dialog: {
                    class: Dialog,
                },
            });
        },
    });
});