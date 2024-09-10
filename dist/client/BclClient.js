"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BclClient = void 0;
const core_1 = require("@ton/core");
const adapters_1 = require("./adapters");
const ofetchHttpProvider_1 = require("./ofetchHttpProvider");
class BclClient {
    constructor(options) {
        this.fetch = async (path, opts) => {
            return await this.httpProvider.get(this.endpoint + path, { query: opts?.query });
        };
        /**
         * Returns paginated list of all coins
         */
        this.fetchCoins = async (opts) => {
            const res = await this.fetch('/getCoins', { query: opts ?? {} });
            return {
                items: res.items.map(adapters_1.normalizeCoin),
                cursor: res.cursor
            };
        };
        /**
         * Returns information on specific coin
         * @param address
         */
        this.fetchCoin = async (address) => {
            let res = await this.fetch('/getCoin/' + address.toString({ urlSafe: true }));
            return (0, adapters_1.normalizeCoin)(res);
        };
        /**
         * Returns events of specific coin
         * @param address
         */
        this.fetchCoinEvents = async (address, opts) => {
            const res = await this.fetch('/getCoinEvents/' + address.toString({ urlSafe: true }), { query: opts ?? {} });
            return {
                items: res.items.map((e) => {
                    return {
                        id: e.id,
                        lt: e.lt,
                        txUtime: e.txUtime,
                        txHash: e.txHash,
                        queryId: e.queryId,
                        event: (0, adapters_1.normalizeCoinEvent)(e.event),
                        coinAddress: core_1.Address.parse(e.coinAddress)
                    };
                }),
                cursor: res.cursor
            };
        };
        /**
         * Returns all events in ton.fun system
         * Useful for syncing with server
         * @param opts
         */
        this.fetchServerEvents = async (opts) => {
            const res = await this.fetch('/getServerEvents', { query: opts ?? {} });
            return {
                items: res.items.map((e) => {
                    return {
                        id: e.id,
                        lt: e.lt,
                        txUtime: e.txUtime,
                        txHash: e.txHash,
                        queryId: e.queryId,
                        event: (0, adapters_1.normalizeCoinEvent)(e.event),
                        coinAddress: core_1.Address.parse(e.coinAddress)
                    };
                }),
                cursor: res.cursor
            };
        };
        this.endpoint = options.endpoint;
        this.httpProvider = options.httpProvider ?? new ofetchHttpProvider_1.OfetchHttpProvider();
    }
}
exports.BclClient = BclClient;
