module.exports = {
	getError(errors, prop) {
		//prop === 'email' || 'password' || 'passwordConfirmation'
		//errors is an array with .mapped it returns each el as an object with different properties
		//we then get the one requested in the prop argument and return the msg value
		try {
			return errors.mapped()[prop].msg;
		} catch (err) {
			return '';
		}
	}
};
