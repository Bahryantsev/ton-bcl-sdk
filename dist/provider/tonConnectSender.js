"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tonConnectSender = tonConnectSender;
const core_1 = require("@ton/core");
const time_1 = require("../utils/time");
// Should be created for each call
function tonConnectSender(tonConnect) {
    let response;
    const responseWaiters = [];
    return {
        get address() {
            const address = tonConnect.account?.address;
            return address ? core_1.Address.parse(address) : undefined;
        },
        async send(args) {
            // The transaction is valid for 10 minutes.
            const validUntil = (0, time_1.unixtime)() + 60 * 10;
            // The address of the recipient, should be in bounceable format for all smart contracts.
            const address = args.to.toString({ urlSafe: true, bounceable: true });
            // The address of the sender, if available.
            const from = this.address?.toRawString();
            // The amount to send in nano tokens.
            const amount = args.value.toString();
            // The state init cell for the contract.
            let stateInit;
            if (args.init) {
                // State init cell for the contract.
                const stateInitCell = (0, core_1.beginCell)()
                    .store((0, core_1.storeStateInit)(args.init))
                    .endCell();
                // Convert the state init cell to boc base64.
                stateInit = stateInitCell.toBoc().toString("base64");
            }
            // The payload for the message.
            let payload;
            if (args.body) {
                // Convert the message body to boc base64.
                payload = args.body.toBoc().toString("base64");
            }
            // Send the message using the TonConnect UI and wait for the message to be sent.
            const res = await tonConnect.sendTransaction({
                validUntil: validUntil,
                from: from,
                messages: [
                    {
                        address: address,
                        amount: amount,
                        stateInit: stateInit,
                        payload: payload
                    }
                ]
            });
            const cell = core_1.Cell.fromBase64(res.boc);
            response = {
                msg: cell,
                hash: cell.hash().toString("hex")
            };
            responseWaiters.forEach((w) => w(response));
        },
        async getResult() {
            return new Promise((resolve) => {
                if (response) {
                    resolve(response);
                    return;
                }
                responseWaiters.push(resolve);
            });
        }
    };
}
