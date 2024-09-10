"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.crc32 = exports.crc32str = exports.tonConnectSender = void 0;
__exportStar(require("./BclSDK"), exports);
__exportStar(require("./provider/simpleTonapiProvider"), exports);
var tonConnectSender_1 = require("./provider/tonConnectSender");
Object.defineProperty(exports, "tonConnectSender", { enumerable: true, get: function () { return tonConnectSender_1.tonConnectSender; } });
var crc32_1 = require("./utils/crc32");
Object.defineProperty(exports, "crc32str", { enumerable: true, get: function () { return crc32_1.crc32str; } });
Object.defineProperty(exports, "crc32", { enumerable: true, get: function () { return crc32_1.crc32; } });
__exportStar(require("./client/types"), exports);
__exportStar(require("./wrappers/BclMaster"), exports);
__exportStar(require("./wrappers/BclJetton"), exports);
__exportStar(require("./wrappers/BclWallet"), exports);
__exportStar(require("./constants"), exports);
__exportStar(require("./utils/referral"), exports);
