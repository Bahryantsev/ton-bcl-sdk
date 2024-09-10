"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeCoin = normalizeCoin;
exports.normalizeCoinEvent = normalizeCoinEvent;
const core_1 = require("@ton/core");
function normalizeCoin(coin) {
    return {
        id: coin.id,
        address: core_1.Address.parse(coin.address),
        metadata: coin.metadata,
        totalSupply: BigInt(coin.totalSupply),
        bclSupply: BigInt(coin.bclSupply),
        liqSupply: BigInt(coin.liqSupply),
        lastTradeDate: coin.lastTradeDate,
        authorAddress: core_1.Address.parse(coin.authorAddress),
        tradingEnabled: coin.tradingEnabled,
        tonLiqCollected: BigInt(coin.tonLiqCollected),
        referral: coin.referral,
        createdAt: coin.createdAt
    };
}
function normalizeCoinEvent(event) {
    if (event.type === "buy") {
        return {
            type: "buy",
            trader: core_1.Address.parse(event.trader),
            tonValue: BigInt(event.tonValue),
            supplyDelta: BigInt(event.supplyDelta),
            newSupply: BigInt(event.newSupply),
            tonLiqCollected: BigInt(event.tonLiqCollected),
            referral: event.referral,
        };
    }
    else if (event.type === "sell") {
        return {
            type: "sell",
            trader: core_1.Address.parse(event.trader),
            tonValue: BigInt(event.tonValue),
            supplyDelta: BigInt(event.supplyDelta),
            newSupply: BigInt(event.newSupply),
            tonLiqCollected: BigInt(event.tonLiqCollected),
            referral: event.referral,
        };
    }
    else if (event.type === "sendLiq") {
        return {
            type: "send_liq",
            tonLiq: BigInt(event.tonLiq),
            jettonLiq: BigInt(event.jettonLiq)
        };
    }
    else if (event.type === "deployment") {
        return {
            type: "deployment",
            metadata: event.metadata,
            totalSupply: BigInt(event.totalSupply),
            bclSupply: BigInt(event.bclSupply),
            liqSupply: BigInt(event.liqSupply),
            lastTradeDate: event.lastTradeDate,
            authorAddress: core_1.Address.parse(event.authorAddress),
            tradingEnabled: event.tradingEnabled,
            tonLiqCollected: BigInt(event.tonLiqCollected),
            referral: event.referral,
            createdAt: event.createdAt
        };
    }
    throw new Error("Unknown BCL event: " + JSON.stringify(event));
}
