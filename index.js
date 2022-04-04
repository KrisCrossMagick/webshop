const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const port = 3000;

const app = express();
//this next line adds the bodyParser to every single route in the code
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: [ 'k:ejfh   meof46506qadq' ] }));
//since we moved the code to the auth file we now after importing it at the top
//need to link it back up with our app instance
app.use(authRouter);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
