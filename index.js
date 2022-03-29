const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//this next line adds the bodyParser to every single route in the code
app.use(bodyParser.urlencoded({ extended: true }));

//lets setup the default route handler
app.get('/', (req, res) => {
	res.send(`
        <div>
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
app.post('/', (req, res) => {
	console.log(req.body);
	res.send('info received!');
});

app.listen(3000, () => {
	console.log('listening on port 3000');
});
