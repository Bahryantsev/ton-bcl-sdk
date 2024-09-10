import { Address, Cell, Contract, ContractProvider, Sender } from "@ton/core";
/**
 * Wrapper for user bcl wallet contract
 */
export declare class BclWallet implements Contract {
    readonly address: Address;
    private constructor();
    static createFromAddress(address: Address): BclWallet;
    /**
     * Returns standard jetton wallet data
     */
    getData(provider: ContractProvider): Promise<{
        balance: bigint;
        owner: Address;
    }>;
    /**
     * Sell operation
     *
     * opts.amount - amount of tokens to sell
     * opts.minReceive - min amount of TONs expected to receive
     */
    sendSellCoins(provider: ContractProvider, via: Sender, opts: {
        amount: bigint;
        minReceive: bigint;
        referral: Cell | null;
        queryId: bigint;
    }): Promise<void>;
    /**
     * Attempt to unlock wallet transfers
     */
    sendUnlockWallet(provider: ContractProvider, via: Sender, opts: {
        queryId?: bigint;
    }): Promise<void>;
    /**
     * Returns wallet lock status
     */
    getTransfersEnabled(provider: ContractProvider): Promise<boolean>;
}
