import { Api } from "tonapi-sdk-js";
import { Address, Contract, ContractProvider, OpenedContract, StateInit } from "@ton/core";
export declare function simpleTonapiProvider(tonapi: Api<any>): {
    open<T extends Contract>(contract: T): OpenedContract<T>;
};
export declare function createProvider(client: Api<any>, params: {
    address: Address;
    init: StateInit | null;
}): ContractProvider;
