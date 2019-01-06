'use strict';

define([
    'jquery',
    'underscore',
    'app/widget/form/form',
    'lib/widget/form/group/form-group',
    'lib/widget/form/element/input-hidden-form-element',
    'lib/widget/form/element/input-text-form-element',
    'lib/widget/form/element/checkbox-form-element',
    'lib/widget/form/label/form-label',
    'lib/widget/icon/fa-icon',
], function ($, _, Form, FormGroup, InputHidden, InputText, Checkbox, Label, Icon) {

    return Form.extend({

        initialize: function () {
            Form.prototype.initialize.call(this, {
                id: 'dashboard-form',
                formGroup: new FormGroup({
                    items: [
                        new InputHidden({
                            name: 'id',
                            defaultValue: '1',
                        }),
                        new InputHidden({
                            name: 'garden_id',
                            defaultValue: '2',
                        }),
                        new InputText({
                            name: 'name',
                            placeholder: polyglot.t('form.placeholder.name'),
                            label: new Label({
                                text: polyglot.t('form.field.name'),
                                icon: new Icon({name: 'user'}),
                            }),
                            validator: function (value) {
                                if (value.length < 4) {
                                    return polyglot.t('form.validator.at-least-x-chars-required', {
                                        field: polyglot.t('form.field.name'),
                                        charCount: 4,
                                    });
                                }
                            },
                        }),
                        new InputText({
                            name: 'title',
                            placeholder: polyglot.t('form.placeholder.title'),
                        }),
                        new FormGroup({
                            items: [
                                new Checkbox({
                                    name: 'active',
                                    label: new Label({text: 'Actif'}),
                                }),
                                new Checkbox({
                                    name: 'check',
                                    label: new Label({text: 'Check'}),
                                }),
                            ],
                        }),
                    ],
                }),
            });
        },
    });
});