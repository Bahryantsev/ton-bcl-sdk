import { Address, Contract, OpenedContract, Sender } from "@ton/core";
import { BclClient } from "./client/BclClient";
import { ClientOptions } from "./client/types";
import { BclJetton } from "./wrappers/BclJetton";
import { DeployCoinInput } from "./wrappers/BclMaster";
export type AnyApiProvider = {
    open<T extends Contract>(contract: T): OpenedContract<T>;
};
type SdkOptions = {
    /**
     * Any API provider compatible with `open` contract mechanics
     * You can use simpleTonapiProvider() which uses tonapi client under the hood
     * Another option is TonClient / TonClient4 from @ton/ton package (toncenter api and tonhub api respectively)
     */
    apiProvider: AnyApiProvider;
    clientOptions: ClientOptions;
    /**
     * Address of the BCL master contract
     */
    masterAddress: Address;
};
export declare class BclSDK {
    readonly apiProvider: AnyApiProvider;
    readonly api: BclClient;
    readonly masterAddress: Address;
    private constructor();
    /**
     * Returns instance of coin wrapper by its address
     */
    openCoin(address: Address): OpenedContract<BclJetton>;
    /**
     * Returns instance of user coin wallet
     * @param coinAddress address of the coin
     * @param userAddress address of user
     */
    openUserCoinWallet(coinAddress: Address, userAddress: Address): Promise<OpenedContract<import(".").BclWallet>>;
    /**
     * Deploys new coin
     */
    deployCoin(sender: Sender, config: DeployCoinInput): Promise<void>;
    /**
     * Returns amount of coins one can get for providing given amount of TONs
     */
    getCoinsForTons(coinAddress: Address, tons: bigint): Promise<{
        fees: bigint;
        coins: bigint;
    }>;
    /**
     * Returns amount of TONs one can get for providing given amount of coins
     */
    getTonsForCoins(coinAddress: Address, coins: bigint): Promise<{
        fees: bigint;
        tons: bigint;
    }>;
    /**
     * Returns users balance for given coin
     */
    getUserCoinBalance(coinAddress: Address, userAddress: Address): Promise<bigint>;
    open<T extends Contract>(contract: T): OpenedContract<T>;
    static create(options: SdkOptions): BclSDK;
}
export {};
