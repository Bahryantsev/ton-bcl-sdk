"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sha256ToBigint = void 0;
const crypto_1 = require("crypto");
// import BN from "bn.js";
// export const sha256ToNumStr = (src: string) => {
//     return (new BN.BN(createHash('sha256').update(src).digest())).toString(10)
// }
//
// export const sha256ToBN = (src: string) => {
//     return (new BN.BN(createHash('sha256').update(src).digest()))
// }
const sha256ToBigint = (src) => {
    return BigInt("0x" + (0, crypto_1.createHash)("sha256").update(src).digest().toString("hex"));
};
exports.sha256ToBigint = sha256ToBigint;
