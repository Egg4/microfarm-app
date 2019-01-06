'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/list/list',
    'lib/widget/list/item/item',
    'lib/widget/html/html',
], function ($, _, List, ListItem, Html) {

    return List.extend({

        initialize: function (options) {
            List.prototype.initialize.call(this, $.extend(true, {
                items: function () {
                    var items = [];
                    _.each(this.errors, function(error) {
                        items.push(new ListItem({
                            content: new Html({
                                template: error.message,
                            }),
                        }));
                    }.bind(this));
                    if (items.length > 0) {
                        $(this.el).show();
                    }
                    else {
                        $(this.el).hide();
                    }
                    return items;
                },
                errors: [],
            }, options));

            $(this.el).addClass('error-list-widget');
            $(this.el).addClass('ui-corner-all');
        },

        setErrors: function (errors) {
            this.errors = errors;
            this.render();
        },
    });
});