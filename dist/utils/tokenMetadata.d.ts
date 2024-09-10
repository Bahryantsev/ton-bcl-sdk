import { Cell } from "@ton/core";
import { Builder } from "@ton/ton";
export declare function flattenSnakeCell(cell: Cell): Buffer;
export declare function makeSnakeCell(data: Buffer): Builder;
export declare function encodeOffChainContent(content: string): Builder;
export declare function decodeOffChainContent(content: Cell): string;
export declare function encodeTextSnake(text: string): Builder;
export type OnChainContentInput = {
    name?: string;
    description?: string;
    image?: string;
    decimals?: number;
    symbol?: string;
    extra?: {
        [key: string]: string;
    };
};
export declare function encodeOnChainContent(input: OnChainContentInput): Cell;
