"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simpleTonapiProvider = simpleTonapiProvider;
exports.createProvider = createProvider;
const tonapi_sdk_js_1 = require("tonapi-sdk-js");
const core_1 = require("@ton/core");
const tonapiUtils_1 = require("../utils/tonapiUtils");
function simpleTonapiProvider(tonapi) {
    return {
        open(contract) {
            return (0, core_1.openContract)(contract, (params) => createProvider(tonapi, params));
        }
    };
}
function createProvider(client, params) {
    return {
        async getState() {
            const res = await client.blockchain.getBlockchainRawAccount(params.address.toRawString());
            let state;
            if (res.status === tonapi_sdk_js_1.AccountStatus.Nonexist ||
                res.status === tonapi_sdk_js_1.AccountStatus.Uninit) {
                state = { type: "uninit" };
            }
            else if (res.status === tonapi_sdk_js_1.AccountStatus.Active) {
                state = {
                    type: "active",
                    code: res.code ? Buffer.from(res.code, "hex") : null,
                    data: res.data ? Buffer.from(res.data, "hex") : null
                };
            }
            else if (res.status === tonapi_sdk_js_1.AccountStatus.Frozen) {
                state = {
                    type: "frozen",
                    stateHash: Buffer.from(res.frozen_hash, "hex")
                };
            }
            else {
                throw new Error("Unknown state");
            }
            return {
                balance: BigInt(res.balance),
                last: res.last_transaction_hash
                    ? {
                        lt: BigInt(res.last_transaction_lt),
                        hash: Buffer.from(res.last_transaction_hash, "hex")
                    }
                    : null,
                state
            };
        },
        async get(name, args) {
            const result = await client.blockchain.execGetMethodForBlockchainAccount(params.address.toRawString(), name, { args: args?.map(tonapiUtils_1.TupleItemToTonapiString) });
            if (!result.success || result.exit_code !== 0) {
                throw new Error();
            }
            return {
                stack: new core_1.TupleReader(result.stack.map(tonapiUtils_1.TvmStackRecordToTupleItem))
            };
        },
        async external(message) {
            throw new Error("Not supported, try using TonClient / TonClient 4");
        },
        async internal(via, message) {
            // Resolve last
            // let last = await client.getLastBlock();
            // Resolve init
            const neededInit = null;
            // if (init && (await client.getAccountLite(last.last.seqno, address)).account.state.type !== 'active') {
            //     neededInit = init;
            // }
            // Resolve bounce
            let bounce = true;
            if (message.bounce !== null && message.bounce !== undefined) {
                bounce = message.bounce;
            }
            // Resolve value
            let value;
            if (typeof message.value === "string") {
                value = (0, core_1.toNano)(message.value);
            }
            else {
                value = message.value;
            }
            // Resolve body
            let body = null;
            if (typeof message.body === "string") {
                body = (0, core_1.comment)(message.body);
            }
            else if (message.body) {
                body = message.body;
            }
            // Send internal message
            await via.send({
                to: params.address,
                value,
                bounce,
                sendMode: message.sendMode,
                init: neededInit,
                body
            });
        },
        open(contract) {
            return (0, core_1.openContract)(contract, (params) => createProvider(client, params));
        },
        async getTransactions(address, lt, hash, limit) {
            throw new Error("Not supported, try using TonClient / TonClient 4");
        }
    };
}
