"use strict";
// MonitoringService.ts
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
class MntMetaService {
    constructor(repository) {
        this.repository = repository;
    }
    get(sid) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.get(sid);
        });
    }
    getList(corp, model) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(model);
            if (model) {
                return yield this.repository.getlistByCorpModel(corp, model);
            }
            else {
                return yield this.repository.getlistByCorp(corp);
            }
        });
    }
    addItem(item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.addnew(item);
        });
    }
    updateItem(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.update(id, item);
        });
    }
    deleteItem(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.delete(id);
        });
    }
}
exports.default = MntMetaService;
