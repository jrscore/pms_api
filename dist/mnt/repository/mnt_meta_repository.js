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
exports.MntMetaRepository = exports.MetaModel = void 0;
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
class MntMetaRepository {
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = yield exports.MetaModel.findOne({ _id: id });
            return doc;
        });
    }
    getlistByCorp(corp) {
        return __awaiter(this, void 0, void 0, function* () {
            const doclst = yield exports.MetaModel.find({ corp: corp });
            return doclst;
        });
    }
    getlistByCorpModel(corp, model) {
        return __awaiter(this, void 0, void 0, function* () {
            const list = yield exports.MetaModel.find({ corp: corp, model: model });
            return list;
        });
    }
    addnew(item) {
        return __awaiter(this, void 0, void 0, function* () {
            const newdoc = yield exports.MetaModel.create(item);
            console.log(newdoc);
            return newdoc;
        });
    }
    update(id, item) {
        return __awaiter(this, void 0, void 0, function* () {
            return Object.assign({ id }, item);
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            yield exports.MetaModel.deleteOne({ _id: id });
            return id;
        });
    }
}
exports.MntMetaRepository = MntMetaRepository;
