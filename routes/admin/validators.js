const { check, validationResult } = require('express-validator');
const usersRepo = require('../../repositories/users');

//adding some validators using express-validator func check()
//but before we do, we sanitize the input as well
//the results of sanitization and validation is added to the req object

module.exports = {
	requireEmail                : check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must be a valid email')
		.custom(async (email) => {
			//check to see if the user with this email is already present in the db
			const existingUser = await usersRepo.getOneBy({ email });
			if (existingUser) throw new Error('Email is in use');
		}),
	requirePassword             : check('password')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be between 4 and 20 characters'),
	requirePasswordConfirmation : check('passwordConfirmation')
		.trim()
		.isLength({ min: 4, max: 20 })
		.withMessage('Must be between 4 and 20 characters')
		.custom((passwordConfirmation, { req }) => {
			if (passwordConfirmation !== req.body.password)
				throw new Error('passwords do not match!');
		}),
	requireEmailExists          : check('email')
		.trim()
		.normalizeEmail()
		.isEmail()
		.withMessage('Must provide a valid email')
		.custom(async (email) => {
			const user = await usersRepo.getOneBy({ email });
			if (!user) throw new Error('email not found');
		}),
	requirePasswordValidForUser : check('password')
		.trim()
		.custom(async (password, { req }) => {
			const user = await usersRepo.getOneBy({ email: req.body.email });
			if (!user) throw new Error('invalid password'); //strange error but it shows up near password so...
			const validPassword = await usersRepo.comparePwd(
				user.password, //from the  db
				password //from the form on the page
			);
			if (!validPassword) throw new Error('Invalid password');
		})
};
