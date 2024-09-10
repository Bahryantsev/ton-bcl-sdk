"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BclSDK = void 0;
const BclClient_1 = require("./client/BclClient");
const BclJetton_1 = require("./wrappers/BclJetton");
const BclMaster_1 = require("./wrappers/BclMaster");
class BclSDK {
    constructor(options) {
        this.apiProvider = options.apiProvider;
        this.api = new BclClient_1.BclClient(options.clientOptions);
        this.masterAddress = options.masterAddress;
    }
    /**
     * Returns instance of coin wrapper by its address
     */
    openCoin(address) {
        return this.apiProvider.open(BclJetton_1.BclJetton.createFromAddress(address));
    }
    /**
     * Returns instance of user coin wallet
     * @param coinAddress address of the coin
     * @param userAddress address of user
     */
    async openUserCoinWallet(coinAddress, userAddress) {
        const coin = this.openCoin(coinAddress);
        return await coin.getUserWallet(userAddress);
    }
    /**
     * Deploys new coin
     */
    async deployCoin(sender, config) {
        const master = this.apiProvider.open(BclMaster_1.BclMaster.createFromAddress(this.masterAddress));
        await master.sendDeployCoin(sender, config);
    }
    /**
     * Returns amount of coins one can get for providing given amount of TONs
     */
    async getCoinsForTons(coinAddress, tons) {
        const coin = this.openCoin(coinAddress);
        return await coin.getCoinsForTons(tons);
    }
    /**
     * Returns amount of TONs one can get for providing given amount of coins
     */
    async getTonsForCoins(coinAddress, coins) {
        const coin = this.openCoin(coinAddress);
        return await coin.getTonsForCoins(coins);
    }
    /**
     * Returns users balance for given coin
     */
    async getUserCoinBalance(coinAddress, userAddress) {
        const coin = this.openCoin(coinAddress);
        const wallet = await coin.getUserWallet(userAddress);
        try {
            const res = await wallet.getData();
            return res.balance;
        }
        catch {
            // In peacetime error means wallet does not exist, which means balance is 0
            return 0n;
        }
    }
    open(contract) {
        return this.apiProvider.open(contract);
    }
    static create(options) {
        return new BclSDK(options);
    }
}
exports.BclSDK = BclSDK;
