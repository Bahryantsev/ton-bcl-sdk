import { Api, TvmStackRecord } from "tonapi-sdk-js";
import { Address, TupleItem, TupleReader } from "@ton/core";
export declare function runGetMethod(client: Api<any>, address: Address, method: string, args?: TupleItem[]): Promise<{
    stack: TupleReader;
}>;
export declare function TvmStackRecordToTupleItem(record: TvmStackRecord): TupleItem;
export declare function TupleItemToTonapiString(item: TupleItem): string;
