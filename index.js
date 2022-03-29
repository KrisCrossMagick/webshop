const express = require('express');

const app = express();

//lets setup the default route handler
app.get('/', (req, res) => {
	res.send('Hi there!');
});

app.listen(3000, () => {
	console.log('listening on port 3000');
});
