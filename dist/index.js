"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMain = exports.getLoopbackAudioMediaStream = void 0;
const renderer_js_1 = require("./renderer.js");
Object.defineProperty(exports, "getLoopbackAudioMediaStream", { enumerable: true, get: function () { return renderer_js_1.getLoopbackAudioMediaStream; } });
const main_js_1 = require("./main.js");
Object.defineProperty(exports, "initMain", { enumerable: true, get: function () { return main_js_1.initMain; } });
// Runtime conditional export based on Electron context
if (process.type === 'renderer') {
    module.exports = { getLoopbackAudioMediaStream: renderer_js_1.getLoopbackAudioMediaStream };
}
else {
    module.exports = { initMain: main_js_1.initMain };
}
//# sourceMappingURL=index.js.map