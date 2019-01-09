'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/bar/bar',
], function ($, _, Bar) {

    return Bar.extend({

        initialize: function (options) {
            Bar.prototype.initialize.call(this, $.extend(true, {
                role: 'footer',
                position: 'fixed',
            }, options));

            $(this.el).addClass('footer');
        },
    });
});