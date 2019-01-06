'use strict';

define([
    'jquery',
    'underscore',
    'backbone',
], function ($, _, Backbone) {

    return Backbone.View.extend({

        initialize: function (options) {
            $.extend(true, this, {
                client: false,
                modelName: false,
            }, options);
        },

        lock: function (id) {
            return this.client.send({
                method: 'POST',
                url: '/' + this.modelName + '/' + id + '/lock',
            });
        },

        unlock: function (id) {
            return this.client.send({
                method: 'POST',
                url: '/' + this.modelName + '/' + id + '/unlock',
            });
        },
    });
});