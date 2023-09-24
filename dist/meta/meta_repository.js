"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const meta_schema = new mongoose_1.Schema({
    corp: String,
    model: String,
    zone: String,
    alias: String,
    url: String,
    id: String,
    pwd: String,
});
exports.MetaModel = mongoose_1.default.model('meta', meta_schema);
// export class MntMetaRepository {
// 	async getById(id: string): Promise<IMeta | null> {
// 		const doc = await MetaModel.findOne({ _id: id });
// 		return doc
// 	}
// 	async getByCorp(corp: string): Promise<IMeta[]> {
// 		const doclst = await MetaModel.find({ corp: corp });
// 		return doclst
// 	}
// 	async getByCorpModel(corp: string, model: string): Promise<IMeta[]> {
// 		const list = await MetaModel.find({ corp: corp, model: model });
// 		return list
// 	}
// 	async addnew(item: any) {
// 		const newdoc = await MetaModel.create(item);
// 		console.log(newdoc);
// 		return newdoc;
// 	}
// 	async update(id: string, item: any) {
// 		return { id, ...item };
// 	}
// 	async delete(id: string) {
// 		await MetaModel.deleteOne({ _id: id });
// 		return id;
// 	}
// }
//# sourceMappingURL=meta_repository.js.map