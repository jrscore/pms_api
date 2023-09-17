import mongoose from "mongoose";

const database = {
	initializer: async () => {
		const db = await mongoose.connect('mongodb+srv://jrscorenet:qkrekfskan@corecluster.q8okyvy.mongodb.net/mnt');
		mongoose.set('debug', true);
	}
};

export { database };
