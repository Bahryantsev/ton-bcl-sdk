"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runGetMethod = runGetMethod;
exports.TvmStackRecordToTupleItem = TvmStackRecordToTupleItem;
exports.TupleItemToTonapiString = TupleItemToTonapiString;
const core_1 = require("@ton/core");
async function runGetMethod(client, address, method, args) {
    const result = await client.blockchain.execGetMethodForBlockchainAccount(address.toRawString(), method, { args: args?.map(TupleItemToTonapiString) });
    if (!result.success || result.exit_code !== 0) {
        throw new Error();
    }
    return {
        stack: new core_1.TupleReader(result.stack.map(TvmStackRecordToTupleItem)),
    };
}
function TvmStackRecordToTupleItem(record) {
    switch (record.type) {
        case "num": {
            if (record.num?.startsWith("-")) {
                return {
                    type: "int",
                    value: BigInt(record.num?.replace("-", "")) * BigInt(-1),
                };
            }
            return { type: "int", value: BigInt(record.num) };
        }
        case "nan":
            return { type: "nan" };
        case "cell":
            try {
                const cell = core_1.Cell.fromBase64(record.cell);
                return { type: "cell", cell };
            }
            catch (_) {
                return {
                    type: "cell",
                    cell: core_1.Cell.fromBase64(Buffer.from(record.cell, "hex").toString("base64")),
                };
            }
        case "null":
            return { type: "null" };
        case "tuple":
            return {
                type: "tuple",
                items: record.tuple.map(TvmStackRecordToTupleItem),
            };
        default:
            throw new Error(`Unknown type ${record.type}`);
    }
}
function TupleItemToTonapiString(item) {
    switch (item.type) {
        case "int": {
            let hexStr = item.value.toString(16);
            if (hexStr.length % 2 !== 0) {
                hexStr = "0" + hexStr;
            }
            return "0x" + hexStr;
        }
        case "nan":
            return "NaN";
        case "null":
            return "Null";
        case "cell":
        case "builder":
            return item.cell.toBoc().toString("base64");
        case "slice":
            return item.cell.toBoc().toString("hex");
        case "tuple":
            throw new Error("Tuple is not supported in TonApi get method parameters");
        default:
            throw new Error(`Unknown type ${item.type}`);
    }
}
