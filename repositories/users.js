const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

//we will use the util nodejs lib to create a promisify function that will
//turn our callback func of "crypto.scrypt" into a promise based func
const scrypt = util.promisify(crypto.scrypt);
class UsersRepository extends Repository {
	async create(attrs) {
		//attrs will contain all attributes for a user we want to store
		//attrs === {email: 'x@y.be', password: 'niet veilig'}
		//we are adding a random id to the data for easy access
		attrs.id = this.randomId();

		const salt = crypto.randomBytes(8).toString('hex');
		//since we promisified the scrypt func we can now write this below
		const buff = await scrypt(attrs.password, salt, 64);

		const records = await this.getAll();

		const record = {
			...attrs,
			password : `${buff.toString('hex')}.${salt}`
		};
		records.push(record);

		await this.writeAll(records);

		return record;
	}

	async comparePwd(saved, supplied) {
		//saved -> password saved in the db (hashed.salt)
		//supplied -> password given by user trying to sign in
		// const result = saved.split('.');
		// const hashed = result[0];
		// const salt = result[1];
		//the above 3 lines of code can be replaced with a single line below
		const [ hashed, salt ] = saved.split('.');
		const hashedSuppliedBuff = await scrypt(supplied, salt, 64);

		return hashed === hashedSuppliedBuff.toString('hex');
	}
}

/**
 * we are exporting an instance of the class instead of the class itself
 * this assures us that we can control the name of the file used to store the users in
 * furthermore we will be able to immediately start using the class methods
 * This is much safer option to avoid hard to find errors in code - because we ONLY NEED ONE instance of this class
 * in the whole project!!
 */
module.exports = new UsersRepository('users.json');
