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
exports.aeonusModel = void 0;
// import { Ivcb } from './model';
const mongoose_1 = __importStar(require("mongoose"));
// schema => model=> doc
const inv_schema = new mongoose_1.Schema({
    no: Number,
    stt: Boolean,
    dcv: Number,
    dca: Number,
    pwr: Number,
    day: Number,
    yld: Number,
}, { _id: false });
const vcb_schema = new mongoose_1.Schema({
    time: Date,
    acb_yld: Number,
    vcb_yld: Number,
}, { _id: false });
const monit_schema = new mongoose_1.Schema({
    date: Date,
    pwr: Number,
    day: Number,
    yld: Number,
    vcb: [vcb_schema],
    invs: [inv_schema]
});
exports.aeonusModel = mongoose_1.default.model('monit', monit_schema);
