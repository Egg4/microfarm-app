'use strict';

define([
    'jquery',
    'underscore',
    'view/widget/form/form',
    'view/widget/form/group/form-group',
    'view/widget/form/element/input-search-form-element',
    'view/widget/button/button',
], function ($, _, Form, FormGroup, InputSearch, Button) {

    return Form.extend({

        initialize: function (options) {
            $.extend(true, this, {
                modelName: false,
                authorize: false,
            }, _.pick(options, 'modelName', 'authorize'));

            var addButton = false;
            if (this.authorize && this.authorize(this.modelName, 'add')) {
                addButton = new Button({
                    text: ' ',
                    icon: 'plus',
                });
            }

            Form.prototype.initialize.call(this, $.extend(true, {
                className: 'search-form',
                formGroup: new FormGroup({
                    type: 'horizontal',
                    items: {
                        search: new InputSearch({
                            name: 'search',
                            placeholder: 'Filter items...',
                            css: {flex: '1'},
                        }),
                        add: addButton,
                    },
                }),
            }, options));
        },
    });
});