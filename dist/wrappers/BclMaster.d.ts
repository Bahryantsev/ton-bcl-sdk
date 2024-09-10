import { Address, Cell, Contract, ContractProvider, Sender } from "@ton/core";
import { BuyOptions } from "./BclJetton";
export type DeployCoinInput = {
    /**
     * Address of the author of the coin
     */
    authorAddress: Address;
    /**
     * Name of the coin
     */
    name: string;
    /**
     * Description of the coin
     */
    description?: string;
    /**
     * Url to the image
     */
    imageUrl?: string;
    /**
     * symbol of the coin
     */
    symbol?: string;
    /**
     * Referral of coin deployment
     */
    referral: Cell | null;
    /**
     * Extra metadata for coin
     */
    extraMetadata: {
        [key: string]: string;
    };
    queryId?: bigint;
};
/**
 * Wrapper for Master BCL contract
 */
export declare class BclMaster implements Contract {
    readonly address: Address;
    private constructor();
    static createFromAddress(address: Address): BclMaster;
    /**
     * Deploys coin
     *
     * firstBuy field allows to make first buy of coins in same transaction as coin deploy
     * Important: when using firstBuy, don't forget to set buyerAddress to the users address, otherwise coins will be lost
     */
    sendDeployCoin(provider: ContractProvider, via: Sender, input: DeployCoinInput, firstBuy?: BuyOptions): Promise<void>;
}
