import e from "express";
import mongoose, { InferSchemaType, Schema } from "mongoose";

const meta_schema: Schema = new Schema({
	corp: String,
	model: String, // CrawlerModel 타입을 string이나 다른 Mongoose 타입으로 적절하게 바꿔주세요.
	zone: String,
	alias: String,
	url: String,
	id: String,
	pwd: String,
});

export type IMeta = InferSchemaType<typeof meta_schema>;
export const MetaModel = mongoose.model<IMeta>('meta', meta_schema);


export class MntMetaRepository {

	async get(id: string): Promise<IMeta | null> {
		const doc = await MetaModel.findOne({ _id: id });
		return doc
	}

	async getlistByCorp(corp: string): Promise<IMeta[]> {
		const doclst = await MetaModel.find({ corp: corp });
		return doclst
	}

	async getlistByCorpModel(corp: string, model: string): Promise<IMeta[]> {
		const list = await MetaModel.find({ corp: corp, model: model });
		return list
	}

	async addnew(item: any) {
		const newdoc = await MetaModel.create(item);
		console.log(newdoc);
		return newdoc;
	}

	async update(id: string, item: any) {
		return { id, ...item };
	}

	async delete(id: string) {
		await MetaModel.deleteOne({ _id: id });
		return id;
	}
}