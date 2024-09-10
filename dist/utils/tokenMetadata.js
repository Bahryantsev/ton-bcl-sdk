"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flattenSnakeCell = flattenSnakeCell;
exports.makeSnakeCell = makeSnakeCell;
exports.encodeOffChainContent = encodeOffChainContent;
exports.decodeOffChainContent = decodeOffChainContent;
exports.encodeTextSnake = encodeTextSnake;
exports.encodeOnChainContent = encodeOnChainContent;
const ton_1 = require("@ton/ton");
const sha256_1 = require("./sha256");
const OFF_CHAIN_CONTENT_PREFIX = 0x01;
const ON_CHAIN_CONTENT_PREFIX = 0x00;
const SNAKE_PREFIX = 0x00;
function flattenSnakeCell(cell) {
    let c = cell;
    let res = Buffer.alloc(0);
    while (c) {
        const cs = c.beginParse();
        // let data = cs.readRemainingBytes()
        const data = cs.loadBuffer(cs.remainingBits / 8);
        res = Buffer.concat([res, data]);
        c = c.refs[0];
    }
    return res;
}
function bufferToChunks(buff, chunkSize) {
    const chunks = [];
    while (buff.byteLength > 0) {
        chunks.push(buff.slice(0, chunkSize));
        buff = buff.slice(chunkSize);
    }
    return chunks;
}
function makeSnakeCell(data) {
    const chunks = bufferToChunks(data, 127);
    const rootCell = (0, ton_1.beginCell)();
    let curCell = rootCell;
    const refs = [];
    for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i];
        curCell.storeBuffer(chunk);
        if (chunks[i + 1]) {
            const nextCell = (0, ton_1.beginCell)();
            refs.push(nextCell);
            curCell = nextCell;
        }
    }
    if (refs.length > 0) {
        let prev = null;
        while (refs.length > 0) {
            const c = refs.pop();
            if (prev) {
                c.storeRef(prev);
            }
            prev = c;
        }
        rootCell.storeRef(prev);
    }
    return rootCell;
}
function encodeOffChainContent(content) {
    let data = Buffer.from(content);
    const offChainPrefix = Buffer.from([OFF_CHAIN_CONTENT_PREFIX]);
    data = Buffer.concat([offChainPrefix, data]);
    return makeSnakeCell(data);
}
function decodeOffChainContent(content) {
    const data = flattenSnakeCell(content);
    const prefix = data[0];
    if (prefix !== OFF_CHAIN_CONTENT_PREFIX) {
        throw new Error(`Unknown content prefix: ${prefix.toString(16)}`);
    }
    return data.slice(1).toString();
}
function encodeTextSnake(text) {
    const data = Buffer.from(text);
    const snakePrefix = Buffer.from([SNAKE_PREFIX]);
    return makeSnakeCell(Buffer.concat([snakePrefix, data]));
}
// tail#_ {bn:#} b:(bits bn) = SnakeData ~0;
// cons#_ {bn:#} {n:#} b:(bits bn) next:^(SnakeData ~n) = SnakeData ~(n + 1);
// chunked_data#_ data:(HashMapE 32 ^(SnakeData ~0)) = ChunkedData;
// text#_ {n:#} data:(SnakeData ~n) = Text;
// snake#00 data:(SnakeData ~n) = ContentData;
// chunks#01 data:ChunkedData = ContentData;
// onchain#00 data:(HashMapE 256 ^ContentData) = FullContent;
// offchain#01 uri:Text = FullContent;
// export function decodeContentData(content: Cell) {
//     let ds = content.beginParse()
//     let prefix = ds.loadUint(8)
//
//     if (prefix === 0x0) {
//         return flattenSnakeCell(ds.asCell())
//     } else if (prefix === 0x01) {
//         // let chunks = ds.readDict(32, (s) => s.readCell())
//         let chunks = ds.loadDict(Dictionary.Keys.Uint(32), Dictionary.Values.Cell())
//         let data = Buffer.alloc(0)
//
//         let keys = chunks.keys().sort((a, b) => a - b)
//
//         for (let key of keys) {
//             let value = chunks.get(key)!.beginParse()
//             data = Buffer.concat([data, value!.loadBuffer(value.remainingBits/8)])
//         }
//
//         return data
//     } else {
//         throw new Error('Unknown content data')
//     }
// }
//
// export class OnChainContent {
//     constructor(private map: Map<string, Buffer>) {
//     }
//
//     getString(key: string) {
//         let value = this.map.get(sha256ToNumStr(key))
//         if (!value) {
//             return null
//         }
//
//         return value.toString()
//     }
//
//     static decode(content: Cell) {
//         throw new Error()
//         // return new OnChainContent(decodeOnChainContent(content))
//     }
// }
//
// function createContentDataValue(): DictionaryValue<Buffer> {
//     return {
//         serialize: (src, buidler) => {
//             buidler.storeRef(buidler)
//         },
//         parse: (src) => {
//             return decodeContentData(src.loadRef())
//         }
//     }
// }
//
function createContentDataValueStore() {
    return {
        serialize: (src, buidler) => {
            buidler.storeRef(src.endCell());
        },
        parse: (src) => {
            return (0, ton_1.beginCell)();
        }
    };
}
function encodeOnChainContent(input) {
    const dict = ton_1.Dictionary.empty(ton_1.Dictionary.Keys.BigUint(256), createContentDataValueStore());
    if (input.name) {
        dict.set((0, sha256_1.sha256ToBigint)("name"), encodeTextSnake(input.name));
    }
    if (input.description) {
        dict.set((0, sha256_1.sha256ToBigint)("description"), encodeTextSnake(input.description));
    }
    if (input.image) {
        dict.set((0, sha256_1.sha256ToBigint)("image"), encodeTextSnake(input.image));
    }
    if (input.decimals) {
        dict.set((0, sha256_1.sha256ToBigint)("decimals"), encodeTextSnake(input.decimals.toString()));
    }
    if (input.symbol) {
        dict.set((0, sha256_1.sha256ToBigint)("symbol"), encodeTextSnake(input.symbol));
    }
    if (input.extra) {
        for (let key in input.extra) {
            let val = input.extra[key];
            dict.set((0, sha256_1.sha256ToBigint)(key), encodeTextSnake(val));
        }
    }
    return (0, ton_1.beginCell)()
        .storeUint(ON_CHAIN_CONTENT_PREFIX, 8)
        .storeDict(dict)
        .endCell();
}
