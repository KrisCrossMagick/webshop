const fs = require('fs');

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
			//the empty array
			fs.writeFileSync(this.filename, '[]');
		}
	}
}

new UsersRepository('users.json');
