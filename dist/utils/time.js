"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.delay = exports.unixtime = void 0;
const unixtime = () => Math.floor(Date.now() / 1000);
exports.unixtime = unixtime;
const delay = (ms) => {
    return new Promise((resolve) => {
        setTimeout(() => resolve(), ms);
    });
};
exports.delay = delay;
