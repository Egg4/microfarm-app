'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/panel/panel',
], function ($, _, Panel) {

    return Panel.extend({

        open: function () {
            this.render();
            return Panel.prototype.open.call(this);
        },
    });
});