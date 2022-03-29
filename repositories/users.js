const fs = require('fs');
const crypto = require('crypto');

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
		//{email: 'x@y.be', password: 'niet veilig'}
		//we are adding a random id to the data for easy access
		attrs.id = this.randomId();
		const records = await this.getAll();
		records.push(attrs);
		await this.writeAll(records);
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
}

const test = async () => {
	const repo = new UsersRepository('users.json');
	await repo.create({ email: 'test@test.com', password: 'niet veilig' });
	const users = await repo.getAll();
	console.log(users);
};

test();
