import { Address, Cell, Contract, ContractProvider, Sender } from "@ton/core";
import { BclWallet } from "./BclWallet";
export type BclData = {
    /**
     * Current supply of the coin
     */
    totalSupply: bigint;
    /**
     * BCL supply of the coin
     * This is the max amount of coins that are going to be sold on curve
     */
    bclSupply: bigint;
    /**
     * Amount of tokens be minted for liquidity on STON.fi
     */
    liqSupply: bigint;
    admin: Address;
    /**
     * Address of the author
     */
    author: Address;
    /**
     * Metadata of the coin in raw format
     */
    content: Cell;
    /**
     * Address of the fees
     */
    feeAddress: Address;
    tradeFeeNumerator: number;
    tradeFeeDenominator: number;
    ttl: number;
    /**
     * Unixtime of last trade
     */
    lastTradeDate: number;
    /**
     * Is trading phase active
     */
    tradingEnabled: boolean;
    /**
     * Amount of TONs collected for STON.fi liquidity
     */
    tonLiqCollected: bigint;
    referral: Cell;
};
export type ContractEvent = EventSendLiq | EventBuy | EventSell;
export type EventSendLiq = {
    type: 'send_liq';
    tonLiq: bigint;
    jettonLiq: bigint;
};
export type EventBuy = {
    type: 'buy';
    trader: Address;
    tonValue: bigint;
    supplyDelta: bigint;
    newSupply: bigint;
    tonLiqCollected: bigint;
    referral: Cell | null;
};
export type EventSell = {
    type: 'sell';
    trader: Address;
    tonValue: bigint;
    supplyDelta: bigint;
    newSupply: bigint;
    tonLiqCollected: bigint;
    referral: Cell | null;
};
/**
 * Parses on-chain events from BCL contract
 * Events are external messages generated on sell/buy/send liq operations
 * @param cell
 */
export declare function parseBclEvent(cell: Cell): ContractEvent;
export type BuyOptions = {
    /**
     * Amount of TONs to spend on coins
     */
    tons: bigint;
    /**
     * Min amount of coins expected to receive
     */
    minReceive: bigint;
    /**
     * Trade referral
     */
    referral: Cell | null;
    /**
     * By default, coins and excess are sent to the sender of transaction
     * You can override that by changing this field
     */
    buyerAddress?: Address;
    queryId?: bigint;
};
/**
 * Wrapper for BCL contract
 */
export declare class BclJetton implements Contract {
    readonly address: Address;
    private constructor();
    static createFromAddress(address: Address): BclJetton;
    /**
     * Returns standard Jetton data
     */
    getData(provider: ContractProvider): Promise<{
        totalSupply: bigint;
        mintable: boolean;
        adminAddress: Address | null;
        jettonContent: Cell;
        jettonWalletCode: Cell;
    }>;
    /**
     * Returns user Jetton wallet address
     */
    getWalletAddress(provider: ContractProvider, address: Address): Promise<Address>;
    /**
     * Returns current price of token
     */
    getCoinPrice(provider: ContractProvider): Promise<bigint>;
    /**
     * Returns how many coins one can get for given amount of TONs
     *
     * fees - amount of platform fees in TONs
     * coins - amount of coins buyer would receive
     */
    getCoinsForTons(provider: ContractProvider, tons: bigint): Promise<{
        fees: bigint;
        coins: bigint;
    }>;
    /**
     * Returns how many TONs one can get for given amount of coins
     *
     * fees - amount of platform fees in TONs
     * tons - amount of TONs user seller would receive
     */
    getTonsForCoins(provider: ContractProvider, coins: bigint): Promise<{
        fees: bigint;
        tons: bigint;
    }>;
    /**
     * Buy operation
     *
     * opts.tons - how many TONs user wants to spend
     * opts.minReceive - min amount of coins expected to receive
     */
    sendBuy(provider: ContractProvider, via: Sender, opts: BuyOptions): Promise<void>;
    /**
     * Returns BCL specific data
     */
    getBclData(provider: ContractProvider): Promise<BclData>;
    /**
     * Returns instance of BclWallet for given user address
     */
    getUserWallet(provider: ContractProvider, userAddress: Address): Promise<import("@ton/core").OpenedContract<BclWallet>>;
}
