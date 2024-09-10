"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Constants = void 0;
const core_1 = require("@ton/core");
exports.Constants = {
    COIN_DEPLOYMENT_PRICE: (0, core_1.toNano)("0.1"),
    BUY_OPERATION_NETWORK_FEE: (0, core_1.toNano)("0.05"),
    SELL_OPERATION_NETWORK_FEE: (0, core_1.toNano)("0.06"),
    WALLET_UNLOCK_OPERATION_NETWORK_FEE: (0, core_1.toNano)("0.05")
};
