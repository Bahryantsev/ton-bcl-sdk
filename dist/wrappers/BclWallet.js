"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BclWallet = void 0;
const core_1 = require("@ton/core");
const constants_1 = require("../constants");
const crc32_1 = require("../utils/crc32");
/**
 * Wrapper for user bcl wallet contract
 */
class BclWallet {
    constructor(address) {
        this.address = address;
    }
    static createFromAddress(address) {
        return new BclWallet(address);
    }
    /**
     * Returns standard jetton wallet data
     */
    async getData(provider) {
        const res = await provider.get("get_wallet_data", []);
        return {
            balance: res.stack.readBigNumber(),
            owner: res.stack.readAddress(),
        };
    }
    /**
     * Sell operation
     *
     * opts.amount - amount of tokens to sell
     * opts.minReceive - min amount of TONs expected to receive
     */
    async sendSellCoins(provider, via, opts) {
        await provider.internal(via, {
            value: constants_1.Constants.SELL_OPERATION_NETWORK_FEE,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            bounce: true,
            body: (0, core_1.beginCell)()
                .storeUint((0, crc32_1.crc32str)("op::sell"), 32)
                .storeUint(opts.queryId ?? 0, 64)
                .storeCoins(opts.amount)
                .storeCoins(opts.minReceive)
                .storeMaybeRef(opts.referral)
                .endCell(),
        });
    }
    /**
     * Attempt to unlock wallet transfers
     */
    async sendUnlockWallet(provider, via, opts) {
        await provider.internal(via, {
            value: constants_1.Constants.WALLET_UNLOCK_OPERATION_NETWORK_FEE,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            bounce: true,
            body: (0, core_1.beginCell)()
                .storeUint((0, crc32_1.crc32str)('op::unlock_wallet'), 32)
                .storeUint(opts.queryId ?? 0, 64)
                .endCell()
        });
    }
    /**
     * Returns wallet lock status
     */
    async getTransfersEnabled(provider) {
        let res = await provider.get('get_transfers_enabled', []);
        return res.stack.readBoolean();
    }
}
exports.BclWallet = BclWallet;
