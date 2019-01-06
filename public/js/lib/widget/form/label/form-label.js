'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/label/label',
], function ($, _, Label) {

    return Label.extend({
        tagName: 'label',

        initialize: function (options) {
            Label.prototype.initialize.call(this, options);

            $(this.el).addClass('form-label-widget');
        },

        setElementId: function (id) {
            $(this.el).attr('for', id);
        },
    });
});