import { BclEvent, Coin } from "./types";
export type AnyObject = Record<string, any>;
export declare function normalizeCoin(coin: AnyObject): Coin;
export declare function normalizeCoinEvent(event: AnyObject): BclEvent;
