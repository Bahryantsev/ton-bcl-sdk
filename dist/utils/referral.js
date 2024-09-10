"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.packReferralConfig = packReferralConfig;
exports.unpackReferralConfig = unpackReferralConfig;
const ton_1 = require("@ton/ton");
const crc32_1 = require("./crc32");
/**
 * Packs referral config to cell
 * @param config
 */
function packReferralConfig(config) {
    let builder = (0, ton_1.beginCell)()
        .storeUint((0, crc32_1.crc32str)('ref_v1'), 32)
        .storeAddress(config.partner);
    if (config.platformTag) {
        builder.storeAddress(config.platformTag);
    }
    if (config.extraTag) {
        if (!config.platformTag) {
            throw new Error('extraTag should only be set if platformTag is present');
        }
        builder.storeAddress(config.extraTag);
    }
    return builder.endCell();
}
/**
 * Unpacks referral cell to config
 * @param packed
 */
function unpackReferralConfig(packed) {
    let cs = packed.beginParse();
    let id = cs.loadUint(32);
    if (id !== (0, crc32_1.crc32str)('ref_v1')) {
        throw new Error('Unknown referral format');
    }
    let partner = cs.loadAddress();
    let platformTag;
    let extraTag;
    if (cs.remainingBits > 0) {
        platformTag = cs.loadAddress();
    }
    if (cs.remainingBits > 0) {
        extraTag = cs.loadAddress();
    }
    return {
        partner,
        platformTag,
        extraTag
    };
}
