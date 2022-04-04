//in order to pass in all the arguments needed to construct the html
//we are going to pass in an object and then deconstruct it (req)
const layout = require('../layout');

module.exports = ({ req }) => {
	return layout({
		content : `
            <div>
                Your id is: ${req.session.userId}
                <form method="POST">
                    <input name="email" placeholder="email" />
                    <input name="password" placeholder="password" />
                    <input name="passwordConfirmation" placeholder="password confirmation" />
                    <button>Sign up</button>
                </form>
            </div>
    `
	});
};
