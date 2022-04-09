const { validationResult } = require('express-validator');

module.exports = {
	handleErrors(templateFunc, dataCallback) {
		return async (req, res, next) => {
			const errors = validationResult(req);

			if (!errors.isEmpty()) {
				let data = {};
				if (dataCallback) data = await dataCallback(req);

				return res.send(templateFunc({ errors, ...data }));
			}
			//in case no errors were encountered, go to the next middleware function
			next();
		};
	},
	requireAuth(req, res, next) {
		if (!req.session.userId) return res.redirect('/signin');
		//in case no errors were encountered, go to the next middleware function
		next();
	}
};
