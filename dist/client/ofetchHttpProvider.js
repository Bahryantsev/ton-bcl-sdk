"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OfetchHttpProvider = void 0;
const ofetch_1 = require("ofetch");
class OfetchHttpProvider {
    get(url, opts) {
        return (0, ofetch_1.ofetch)(url, { query: opts.query });
    }
    post(url, data) {
        return (0, ofetch_1.ofetch)(url, {
            method: "POST",
            body: JSON.stringify(data),
        });
    }
}
exports.OfetchHttpProvider = OfetchHttpProvider;
