const express = require('express');

const app = express();

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

const bodyParser = (req, res, next) => {
	if (req.method === 'POST') {
		req.on('data', (data) => {
			//this is the data received
			//email=dev%40kriscrossmagick.com&password=qqqqqqq&passwordConfirmation=fefezefzef
			//we will now split it on the '&' sign to receive key value pairs in the array "parsed"
			const parsed = data.toString('utf8').split('&');
			const formData = {};
			for (let pair of parsed) {
				//the pair now contains a string in the format email=kris.allaert@pm.me
				//so we can assign a key value pair like so
				const [ key, value ] = pair.split('=');
				//and then we assign them to the formData object
				formData[key] = value;
			}
			req.body = formData;
			next();
		});
	}
	else {
		next();
	}
};

//the bodyParser is a middleware function
//it is possible to have multiple middleware function in a row, seperated by a ','
app.post('/', bodyParser, (req, res) => {
	console.log(req.body);
	res.send('info received!');
});

app.listen(3000, () => {
	console.log('listening on port 3000');
});
