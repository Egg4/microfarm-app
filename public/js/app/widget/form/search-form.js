'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/form/form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-search-form-element',
], function ($, _, Form, FormGroup, InputSearch) {

    return Form.extend({

        initialize: function (options) {

            var defaults = {
                placeholder: polyglot.t('form.placeholder.search'),
                buttons: [],
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            this.inputSearch = new InputSearch({
                name: 'search',
                placeholder: this.placeholder,
                css: {flex: '1'},
            });

            Form.prototype.initialize.call(this, $.extend(true, {
                formGroup: new FormGroup({
                    type: 'horizontal',
                    items: this.buildItems(),
                }),
            }, options));

            $(this.el).addClass('search-form');
        },

        buildItems: function () {
            var items = [];
            items.push(this.inputSearch);
            _.each(this.buttons, function (button) {
                items.push(button);
            });
            return items;
        },
    });
});