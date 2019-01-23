'use strict';

define([
    'jquery',
    'underscore',
    'lib/collection/collection',
], function ($, _, Collection) {

    return Collection.extend({

        findRoot: function (key) {
            return this.findWhere({
                parent_id: null,
                key: key,
            });
        },
    });
});