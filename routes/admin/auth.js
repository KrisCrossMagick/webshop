const express = require('express');
const { check, validationResult } = require('express-validator');

const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');
const {
	requireEmail,
	requirePassword,
	requirePasswordConfirmation,
	requireEmailExists,
	requirePasswordValidForUser
} = require('./validators');

const router = express.Router();

router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

router.post(
	'/signup',
	//call the validators for the signup fields
	[ requireEmail, requirePassword, requirePasswordConfirmation ],
	async (req, res) => {
		//in order to see the results of check validator
		//we inspect the errors object below after passing req to validationResult(req)
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.send(signupTemplate({ req, errors }));

		const { email, password, passwordConfirmation } = req.body;
		//create a user in our repo
		const user = await usersRepo.create({ email, password });

		//store the id of that user inside the user cookie
		//the req.session property is added automatically by cookie session
		//otherwise it is not present!
		//then we add the userId property (can be anything we want, this name is prefered)
		req.session.userId = user.id;

		res.send('account created!');
	}
);

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out!');
});

router.get('/signin', (req, res) => {
	res.send(signinTemplate({}));
});

router.post(
	'/signin',
	//call the validators for the signin fields
	[ requireEmailExists, requirePasswordValidForUser ],
	async (req, res) => {
		//in order to see the results of check validator
		//we inspect the errors object below after passing req to validationResult(req)
		const errors = validationResult(req);
		if (!errors.isEmpty()) return res.send(signinTemplate({ errors }));

		const { email } = req.body;

		const user = await usersRepo.getOneBy({ email });

		req.session.userId = user.id;
		res.send('You are signed in');
	}
);

module.exports = router;
