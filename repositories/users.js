const fs = require('fs');
const crypto = require('crypto');
const util = require('util');

//we will use the util nodejs lib to create a promisify function that will
//turn our callback func of "crypto.scrypt" into a promise based func
const scrypt = util.promisify(crypto.scrypt);
class UsersRepository {
	constructor(filename) {
		if (!filename) {
			throw new Error('creating a repo requires a filename');
		}
		//store the filename in an instance variable
		this.filename = filename;
		//it is not recommended to use a synchronous function to avoid delays or hanging your code
		//however in the constructor func a async function is NOT ALLOWED
		//so we would have to move it out this constructor to a seperate func and we do not want that here
		//this fs.accessSync will only be called once during the lifecycle of the program so it is ok
		try {
			fs.accessSync(this.filename);
		} catch (err) {
			//the empty array is there to make sure we always get back an array structure even if the file is empty
			fs.writeFileSync(this.filename, '[]');
		}
	}

	async getAll() {
		//open the file
		//parse the contents back to js object
		//return the parsed data
		return JSON.parse(
			await fs.promises.readFile(this.filename, {
				encoding : 'utf8'
			})
		);
	}

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

	async writeAll(records) {
		//write the updated records array back to the file - we write all records back each time!!
		//in the stringify the null is for the custom formatter we are not using
		//the number 2 is for the spacing of records
		await fs.promises.writeFile(
			this.filename,
			JSON.stringify(records, null, 2)
		);
	}

	randomId() {
		return crypto.randomBytes(4).toString('hex');
	}

	async getOne(id) {
		const records = await this.getAll();
		return records.find((record) => record.id === id);
	}

	async delete(id) {
		const records = await this.getAll();
		//only records with true are retained, so we want it to be true in case it does not match
		const filteredRecords = records.filter((record) => record.id !== id);
		await this.writeAll(filteredRecords);
	}

	async update(id, attrs) {
		const records = await this.getAll();
		const record = records.find((record) => record.id === id);

		if (!record) throw new Error(`Record with id ${id} was not found!`);

		//the Object.assign() takes all the elements from the second argument (SOURCE) and puts them in the first argument (TARGET)
		//updating the existing ones or writing new ones if needed
		Object.assign(record, attrs);

		await this.writeAll(records);
	}

	async getOneBy(filters) {
		const records = await this.getAll();

		//here we use for...of statement to iterate through an array!
		for (let record of records) {
			let found = true;

			//here we use the for...in statement to iterate through an object!
			for (let key in filters) {
				if (record[key] !== filters[key]) found = false;
			}

			if (found) return record;
		}
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
