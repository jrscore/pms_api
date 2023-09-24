import { Meta, MetaModel } from "./meta_repository";




export class MetaService {

	// Not Yet
	static async getById(id: string): Promise<Meta | null> {
		const doc = await MetaModel.findOne({ _id: id });
		return doc
	}

	// 사이트이름
	static async getMetaByAlias(alias: string): Promise<Meta | null> {
		try {
			const doc = await MetaModel.findOne({ alias: alias })
			return doc
		} catch (error) {
			throw new Error('Server Error')
		}
	}


	// 회사전체리스트
	static async getListByCorp(corp: string): Promise<Meta[] | {}> {
		const meta = await MetaModel.find({ corp: corp });
		if (!meta) {
			return {};
		}
		return meta;
	}

	// 회사별 모델리스트
	static async getListByModel(model: string): Promise<Meta | {}> {
		const meta = await MetaModel.find({ model: model });
		if (!meta) {
			return {};
		}
		return meta;
	}

	static async addnew(item: any) {
		const newdoc = await MetaModel.create(item);
		console.log(newdoc);
		return newdoc;
	}

	static async update(id: string, item: any) {
		return { id, ...item };
	}

	static async delete(id: string) {
		await MetaModel.deleteOne({ _id: id });
		return id;
	}
}
