const express = require('express');

const app = express();

//lets setup the default route handler
app.get('/', (req, res) => {
	res.send(`
        <div>
            <form>
                <input placeholder="email" />
                <input placeholder="password" />
                <input placeholder="password confirmation" />
                <button>Sign up</button>
            </form>
        </div>
    `);
});

app.listen(3000, () => {
	console.log('listening on port 3000');
});
