import { Cell, Sender } from "@ton/core";
import type { Account as TonConnectAccount, SendTransactionRequest, ActionConfiguration, SendTransactionResponse } from "@tonconnect/ui";
type SendResponse = {
    msg: Cell;
    hash: string;
};
export type TonConnectLikeObject = {
    get account(): TonConnectAccount | null;
    sendTransaction(tx: SendTransactionRequest, options?: ActionConfiguration): Promise<SendTransactionResponse>;
};
export declare function tonConnectSender(tonConnect: TonConnectLikeObject): Sender & {
    getResult(): Promise<SendResponse>;
};
export {};
