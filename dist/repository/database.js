"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
class Database {
    constructor() {
        this.db_url = 'mongodb+srv://jrscorenet:qkrekfskan@corecluster.q8okyvy.mongodb.net/obmonit';
    }
    connect() {
        mongoose_1.default.set('debug', true);
        console.log("DB URL:", this.db_url);
        mongoose_1.default.connect(this.db_url)
            .then(() => {
            console.log('DB Connected');
        })
            .catch((error) => {
            console.error(`DB Err \n${error}`);
        });
    }
}
exports.default = new Database();
