const express = require('express');
const usersRepo = require('../../repositories/users');
const signupTemplate = require('../../views/admin/auth/signup');
const signinTemplate = require('../../views/admin/auth/signin');

const router = express.Router();

//lets setup the default route handler
router.get('/signup', (req, res) => {
	res.send(signupTemplate({ req }));
});

//the bodyParser is a middleware function
//it is possible to have multiple middleware function in a row, seperated by a ','
//ORIGINAL: router.post('/', bodyParser.urlencoded({ extended: true }), (req, res) => {
//we moved it to the top under router = express() - so it will be used in ALL routing func as middleware func without
//having to specify it every single time
router.post('/signup', async (req, res) => {
	const { email, password, passwordConfirmation } = req.body;

	//check to see if the user with this email is already present in the db
	const existingUser = await usersRepo.getOneBy({ email });
	if (existingUser) return res.send('Email is in use');

	if (password !== passwordConfirmation)
		return res.send('password and confirmation must match!');

	//create a user in our repo
	const user = await usersRepo.create({ email, password });

	//store the id of that user inside the user cookie
	//the req.session property is added automatically by cookie session
	//otherwise it is not present!
	//then we add the userId property (can be anything we want, this name is prefered)
	req.session.userId = user.id;

	res.send('account created!');
});

router.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out!');
});

router.get('/signin', (req, res) => {
	res.send(signinTemplate());
});

router.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	const user = await usersRepo.getOneBy({ email });
	if (!user) return res.send('email not found');

	const validPassword = await usersRepo.comparePwd(
		user.password, //from the  db
		password //from the form on the page
	);
	if (!validPassword) return res.send('Invalid password');
	req.session.userId = user.id;
	res.send('You are signed in');
});

module.exports = router;
