
// MonitoringService.ts

import { IMeta, MntMetaRepository } from "../repository/mnt_meta_repository";


class MntMetaService {
	constructor(private repository: MntMetaRepository) { }

	async get(sid: string): Promise<IMeta | null> {
		return await this.repository.get(sid)
	}
	
	async getList(corp: string, model?: string): Promise<IMeta[]> {
		console.log(model)
		if (model) {
			return await this.repository.getlistByCorpModel(corp, model)
		} else {
			return await this.repository.getlistByCorp(corp)
		}
	}

	async addItem(item: any) {
		return await this.repository.addnew(item);
	}

	async updateItem(id: string, item: any) {
		return await this.repository.update(id, item);
	}

	async deleteItem(id: string) {
		return await this.repository.delete(id);
	}
}

export default MntMetaService;
