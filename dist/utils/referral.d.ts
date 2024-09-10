import { Address, Cell } from "@ton/core";
export type ReferralConfig = {
    /**
     * Referral for ton.fun partners
     */
    partner: Address;
    /**
     * Used on partner side for internal tracking
     */
    platformTag?: Address;
    /**
     * Extra field for partner side, should be used only if platformTag is occupied
     */
    extraTag?: Address;
};
/**
 * Packs referral config to cell
 * @param config
 */
export declare function packReferralConfig(config: ReferralConfig): Cell;
/**
 * Unpacks referral cell to config
 * @param packed
 */
export declare function unpackReferralConfig(packed: Cell): {
    partner: Address;
    platformTag: Address | undefined;
    extraTag: Address | undefined;
};
