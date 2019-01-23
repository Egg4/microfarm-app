'use strict';

define([
    'jquery',
    'underscore',
    'lib/model/model',
], function ($, _, Model) {

    return Model.extend({

        findParent: function () {
            return this.collection.get(this.get('parent_id'));
        },

        findRoot: function () {
            return _.isNull(this.get('parent_id')) ? this : this.findParent().findRoot();
        },

        findChild: function (where) {
            return this.collection.findWhere($.extend(where, {
                parent_id: this.get('id'),
            }));
        },

        findChildren: function (where) {
            return this.collection.where($.extend(where, {
                parent_id: this.get('id'),
            }));
        },
    });
});