const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const usersRepo = require('./repositories/users');

const port = 3000;

const app = express();
//this next line adds the bodyParser to every single route in the code
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: [ 'k:ejfh   meof46506qadq' ] }));

//lets setup the default route handler
app.get('/signup', (req, res) => {
	res.send(`
        <div>
            Your id is: ${req.session.userId}
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <input name="passwordConfirmation" placeholder="password confirmation" />
                <button>Sign up</button>
            </form>
        </div>
    `);
});

//the bodyParser is a middleware function
//it is possible to have multiple middleware function in a row, seperated by a ','
//ORIGINAL: app.post('/', bodyParser.urlencoded({ extended: true }), (req, res) => {
//we moved it to the top under app = express() - so it will be used in ALL routing func as middleware func without
//having to specify it every single time
app.post('/signup', async (req, res) => {
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

app.get('/signout', (req, res) => {
	req.session = null;
	res.send('You are logged out!');
});

app.get('/signin', (req, res) => {
	res.send(`
        <div>
            <form method="POST">
                <input name="email" placeholder="email" />
                <input name="password" placeholder="password" />
                <button>Sign in</button>
            </form>
        </div>    
    `);
});

app.post('/signin', async (req, res) => {
	const { email, password } = req.body;
	const user = await usersRepo.getOneBy({ email });
	if (!user) return res.send('email not found');
	if (user.password !== password) return res.send('Invalid password');
	req.session.userId = user.id;
	res.send('You are signed in');
});

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
