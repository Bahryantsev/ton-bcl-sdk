"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BclMaster = void 0;
const core_1 = require("@ton/core");
const constants_1 = require("../constants");
const crc32_1 = require("../utils/crc32");
const tokenMetadata_1 = require("../utils/tokenMetadata");
/**
 * Wrapper for Master BCL contract
 */
class BclMaster {
    constructor(address) {
        this.address = address;
    }
    static createFromAddress(address) {
        return new BclMaster(address);
    }
    /**
     * Deploys coin
     *
     * firstBuy field allows to make first buy of coins in same transaction as coin deploy
     * Important: when using firstBuy, don't forget to set buyerAddress to the users address, otherwise coins will be lost
     */
    async sendDeployCoin(provider, via, input, firstBuy) {
        let content = (0, tokenMetadata_1.encodeOnChainContent)({
            name: input.name,
            description: input.description,
            image: input.imageUrl,
            symbol: input.symbol,
            decimals: 9,
            extra: input.extraMetadata
        });
        let message = (0, core_1.beginCell)()
            .storeUint((0, crc32_1.crc32str)("op::deploy_coin"), 32)
            .storeUint(input.queryId ?? 0, 64)
            .storeRef(content)
            .storeAddress(input.authorAddress)
            .storeRef(input.referral ?? (0, core_1.beginCell)().endCell());
        if (firstBuy) {
            let buyMessage = (0, core_1.beginCell)()
                .storeUint((0, crc32_1.crc32str)("op::buy"), 32)
                .storeUint(firstBuy.queryId ?? 0, 64)
                .storeCoins(firstBuy.minReceive)
                .storeMaybeRef(firstBuy.referral);
            if (firstBuy.buyerAddress) {
                buyMessage.storeAddress(firstBuy.buyerAddress);
            }
            message.storeRef(buyMessage.endCell());
        }
        await provider.internal(via, {
            value: constants_1.Constants.COIN_DEPLOYMENT_PRICE,
            sendMode: core_1.SendMode.PAY_GAS_SEPARATELY,
            bounce: true,
            body: message.endCell()
        });
    }
}
exports.BclMaster = BclMaster;
