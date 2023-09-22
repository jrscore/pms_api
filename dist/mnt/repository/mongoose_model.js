"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aeonModel = exports.monitModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const gridSchema = new mongoose_1.default.Schema({
    time: Date,
    inmth: Number,
    incrt: Number,
    genmth: Number,
    gencrt: Number,
    ct: Number,
}, { _id: false });
const vcbSchema = new mongoose_1.default.Schema({
    time: Date,
    acb_yld: Number,
    vcb_yld: Number,
}, { _id: false });
const inverterSchema = new mongoose_1.default.Schema({
    no: Number,
    stt: Boolean,
    dcv: Number,
    dca: Number,
    pwr: Number,
    day: Number,
    mth: Number,
    yld: Number,
}, { _id: false });
const pvSchema = new mongoose_1.default.Schema({
    date: Date,
    pwr: Number,
    day: Number,
    mth: Number,
    yld: Number,
    invs: [inverterSchema]
}, { _id: false });
const monitSchema = new mongoose_1.default.Schema({
    grid: { type: gridSchema, default: null },
    vcb: { type: vcbSchema, default: null },
    pv: pvSchema
});
exports.monitModel = mongoose_1.default.model('monit', monitSchema);
exports.aeonModel = mongoose_1.default.model('log', monitSchema);
