'use strict';

define([
    'jquery',
    'underscore',
    'lib/widget/form/form',
], function ($, _, Form) {

    return Form.extend({

        initialize: function (options) {
            Form.prototype.initialize.call(this, options);

            var defaults = {
                collection: false,
            };
            $.extend(true, this, defaults, _.pick(options, _.keys(defaults)));

            $(this.el).addClass('model-form-widget');
        },

        validator: function (data) {
            var errors = Form.prototype.validator.call(this, data);
            if (!this.collection.isUnique(data)) {
                var modelName = polyglot.t('model.name.' + this.collection.modelName, {_: this.collection.modelName});
                errors.push({
                    attributes: this.collection.uniqueAttributes,
                    message: polyglot.t('form.validator.not-unique', {
                        _: '%{model}: this model already exists',
                        model: modelName,
                    }),
                });
            }
            return errors;
        },

        submit: function() {
            var deferred = $.Deferred();
            if (!this.validate()) return deferred.reject();

            var data = this.getData();
            var model = parseInt(data.id) ? this.collection.get(data.id) : new this.collection.model(_.omit(data, 'id'));
            if (model.isNew()) {
                this.collection.create(model, {
                    success: deferred.resolve
                });
            }
            else {
                model.save(data, {
                    success: deferred.resolve
                });
            }

            return deferred.promise();
        },
    });
});