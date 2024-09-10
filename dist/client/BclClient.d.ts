import { Address } from "@ton/core";
import { ClientOptions, Coin, GetCoinsResponse, GetEventsResponse } from "./types";
import { HttpProviderBase } from "../provider/httpProviderBase";
export type TransactionStatus = "done" | "failed" | "in_progress" | "not_found";
export declare class BclClient {
    readonly endpoint: string;
    readonly httpProvider: HttpProviderBase;
    constructor(options: ClientOptions);
    private fetch;
    /**
     * Returns paginated list of all coins
     */
    fetchCoins: (opts?: {
        first?: number;
        after?: string;
        reverse?: boolean;
    }) => Promise<GetCoinsResponse>;
    /**
     * Returns information on specific coin
     * @param address
     */
    fetchCoin: (address: Address) => Promise<Coin>;
    /**
     * Returns events of specific coin
     * @param address
     */
    fetchCoinEvents: (address: Address, opts?: {
        first?: number;
        after?: string;
        reverse?: boolean;
    }) => Promise<GetEventsResponse>;
    /**
     * Returns all events in ton.fun system
     * Useful for syncing with server
     * @param opts
     */
    fetchServerEvents: (opts?: {
        first?: number;
        after?: string;
        reverse?: boolean;
    }) => Promise<{
        items: any;
        cursor: any;
    }>;
}
