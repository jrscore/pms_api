import mongoose from 'mongoose';


class Database {
	private db_url = 'mongodb+srv://jrscorenet:qkrekfskan@corecluster.q8okyvy.mongodb.net/obmonit'
	constructor() { }

	connect(): void {
		mongoose.set('debug', true);
		console.log("DB URL:", this.db_url);
		mongoose.connect(this.db_url)
			.then(() => {
				console.log('DB Connected');
			})
			.catch((error) => {
				console.error(`DB Err \n${error}`);
			});
	}
}
export default new Database();
