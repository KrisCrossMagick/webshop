const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth');

const port = 3000;

const app = express();
//this next line adds the bodyParser to every single route in the code
//the bodyParser is a middleware function
//it is possible to have multiple middleware function in a row, seperated by a ','
//ORIGINAL: router.post('/', bodyParser.urlencoded({ extended: true }), (req, res) => {
//we moved it to the top under router = express() - so it will be used in ALL routing func as middleware func without
//having to specify it every single time
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({ keys: [ 'k:ejfh   meof46506qadq' ] }));
//since we moved the code to the auth file we now after importing it at the top
//need to link it back up with our app instance
app.use(authRouter);

app.listen(port, () => {
	console.log(`listening on port ${port}`);
});
