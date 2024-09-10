"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BclJetton = void 0;
exports.parseBclEvent = parseBclEvent;
const core_1 = require("@ton/core");
const constants_1 = require("../constants");
const crc32_1 = require("../utils/crc32");
const BclWallet_1 = require("./BclWallet");
/**
 * Parses on-chain events from BCL contract
 * Events are external messages generated on sell/buy/send liq operations
 * @param cell
 */
function parseBclEvent(cell) {
    let cs = cell.beginParse();
    let eventId = cs.loadUint(32);
    if (eventId === (0, crc32_1.crc32str)('send_liq_log')) {
        return {
            type: 'send_liq',
            tonLiq: cs.loadCoins(),
            jettonLiq: cs.loadCoins(),
        };
    }
    else if (eventId === (0, crc32_1.crc32str)('sell_log')) {
        return {
            type: 'sell',
            trader: cs.loadAddress(),
            tonValue: cs.loadCoins(),
            supplyDelta: cs.loadCoins(),
            newSupply: cs.loadCoins(),
            tonLiqCollected: cs.loadCoins(),
            referral: cs.loadMaybeRef()
        };
    }
    else if (eventId === (0, crc32_1.crc32str)('buy_log')) {
        return {
            type: 'buy',
            trader: cs.loadAddress(),
            tonValue: cs.loadCoins(),
            supplyDelta: cs.loadCoins(),
            newSupply: cs.loadCoins(),
            tonLiqCollected: cs.loadCoins(),
            referral: cs.loadMaybeRef()
        };
    }
    throw new Error('Unknown BCL event with id: ' + eventId.toString(16));
}
/**
 * Wrapper for BCL contract
 */
class BclJetton {
    constructor(address) {
        this.address = address;
    }
    static createFromAddress(address) {
        return new BclJetton(address);
    }
    /**
     * Returns standard Jetton data
     */
    async getData(provider) {
        const res = (await provider.get("get_jetton_data", [])).stack;
        return {
            totalSupply: res.readBigNumber(),
            mintable: res.readBigNumber() !== BigInt(0),
            adminAddress: res.readAddressOpt(),
            jettonContent: res.readCell(),
            jettonWalletCode: res.readCell()
        };
    }
    /**
     * Returns user Jetton wallet address
     */
    async getWalletAddress(provider, address) {
        const res = await provider.get("get_wallet_address", [
            { type: "slice", cell: (0, core_1.beginCell)().storeAddress(address).endCell() }
        ]);
        return res.stack.readAddress();
    }
    /**
     * Returns current price of token
     */
    async getCoinPrice(provider) {
        const res = await provider.get("coin_price", []);
        return res.stack.readBigNumber();
    }
    /**
     * Returns how many coins one can get for given amount of TONs
     *
     * fees - amount of platform fees in TONs
     * coins - amount of coins buyer would receive
     */
    async getCoinsForTons(provider, tons) {
        const res = await provider.get("coins_for_tons", [
            { type: "int", value: tons }
        ]);
        return {
            fees: res.stack.readBigNumber(),
            coins: res.stack.readBigNumber()
        };
    }
    /**
     * Returns how many TONs one can get for given amount of coins
     *
     * fees - amount of platform fees in TONs
     * tons - amount of TONs user seller would receive
     */
    async getTonsForCoins(provider, coins) {
        const res = await provider.get("tons_for_coins", [
            { type: "int", value: coins }
        ]);
        return {
            fees: res.stack.readBigNumber(),
            tons: res.stack.readBigNumber()
        };
    }
    /**
     * Buy operation
     *
     * opts.tons - how many TONs user wants to spend
     * opts.minReceive - min amount of coins expected to receive
     */
    async sendBuy(provider, via, opts) {
        await provider.internal(via, {
            value: opts.tons + constants_1.Constants.BUY_OPERATION_NETWORK_FEE,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            bounce: true,
            body: (0, core_1.beginCell)()
                .storeUint((0, crc32_1.crc32str)("op::buy"), 32)
                .storeUint(opts.queryId ?? 0, 64)
                .storeCoins(opts.minReceive)
                .storeMaybeRef(opts.referral)
                .endCell()
        });
    }
    /**
     * Returns BCL specific data
     */
    async getBclData(provider) {
        const res = (await provider.get("get_bcl_data", [])).stack;
        return {
            totalSupply: res.readBigNumber(),
            bclSupply: res.readBigNumber(),
            liqSupply: res.readBigNumber(),
            admin: res.readAddress(),
            author: res.readAddress(),
            content: res.readCell(),
            feeAddress: res.readAddress(),
            tradeFeeNumerator: res.readNumber(),
            tradeFeeDenominator: res.readNumber(),
            ttl: res.readNumber(),
            lastTradeDate: res.readNumber(),
            tradingEnabled: res.readBoolean(),
            tonLiqCollected: res.readBigNumber(),
            referral: res.readCell()
        };
    }
    /**
     * Returns instance of BclWallet for given user address
     */
    async getUserWallet(provider, userAddress) {
        const walletAddress = await this.getWalletAddress(provider, userAddress);
        return provider.open(BclWallet_1.BclWallet.createFromAddress(walletAddress));
    }
}
exports.BclJetton = BclJetton;
