module.exports = function(mongoose) {
	var SchemaNumber = mongoose.SchemaTypes.Number,
		errorMessages = mongoose.Error.messages;

	/**
	 * Sets a minimum number validator not including the configurated value.
	 *
	 * ####Example:
	 *
	 *     var s = new Schema({ n: { type: Number, exclusivemin: 10 })
	 *     var M = db.model('M', s)
	 *     var m = new M({ n: 9 })
	 *     m.save(function (err) {
	 *       console.error(err) // validator error
	 *       m.n = 10;
	 *       m.save() // success
	 *     })
	 *
	 *     // custom error messages
	 *     // We can also use the special {EXCLUSIVE_MIN} token which will be replaced with the invalid value
	 *     var min = [10, 'The value of path `{PATH}` ({VALUE}) should be greater than ({EXCLUSIVE_MIN}).'];
	 *     var schema = new Schema({ n: { type: Number, min: min })
	 *     var M = mongoose.model('Measurement', schema);
	 *     var s= new M({ n: 4 });
	 *     s.validate(function (err) {
	 *       console.log(String(err)) // ValidationError: The value of path `n` (4) should be greater than 10.
	 *     })
	 *
	 * @param {Number} value minimum number
	 * @param {String} [message] optional custom error message
	 * @return {SchemaType} this
	 * @see Customized Error Messages #error_messages_MongooseError-messages
	 * @api public
	 */

	SchemaNumber.prototype.exclusivemin = function (value, message) {
		if (this.exclusiveminValidator) {
			this.validators = this.validators.filter(function (v) {
				return v.validator !== this.exclusiveminValidator;
			}, this);
		}

		if (null !== value) {
			var msg = message || errorMessages.Number.exclusivemin;
			msg = msg.replace(/{EXCLUSIVE_MIN}/, value);
			this.validators.push([this.exclusiveminValidator = function (v) {
				return v === null || v === undefined || v > value;
			}, msg, 'exclusivemin']);
		}

		return this;
	};

	errorMessages.Number.exclusivemin = 'Path `{PATH}` ({VALUE}) should be greater than {EXCLUSIVE_MIN}.';
};
