"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaService = void 0;
const meta_repository_1 = require("./meta_repository");
class MetaService {
    // Not Yet
    static getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield meta_repository_1.MetaModel.findOne({ _id: id });
            return doc;
        });
    }
    // 사이트이름
    static getMetaByAlias(alias) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const doc = yield meta_repository_1.MetaModel.findOne({ alias: alias });
                return doc;
            }
            catch (error) {
                throw new Error('Server Error');
            }
        });
    }
    // 회사전체리스트
    static getListByCorp(corp) {
        return __awaiter(this, void 0, void 0, function* () {
            const meta = yield meta_repository_1.MetaModel.find({ corp: corp });
            if (!meta) {
                return {};
            }
            return meta;
        });
    }
    // 회사별 모델리스트
    static getListByModel(model) {
        return __awaiter(this, void 0, void 0, function* () {
            const meta = yield meta_repository_1.MetaModel.find({ model: model });
            if (!meta) {
                return {};
            }
            return meta;
        });
    }
    static addnew(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const newdoc = yield meta_repository_1.MetaModel.create(item);
            console.log(newdoc);
            return newdoc;
        });
    }
    static update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.assign({ id }, item);
        });
    }
    static delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield meta_repository_1.MetaModel.deleteOne({ _id: id });
            return id;
        });
    }
}
exports.MetaService = MetaService;
//# sourceMappingURL=meta_service.js.map