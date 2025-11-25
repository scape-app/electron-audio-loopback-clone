"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoopbackAudioMediaStream = void 0;
const electron_1 = require("electron");
const config_js_1 = require("./config.js");
const getLoopbackAudioMediaStream = async (options = {}) => {
    const { removeVideo = true } = options;
    await electron_1.ipcRenderer.invoke(config_js_1.ipcEvents.enableLoopbackAudio);
    const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
    // As of August 2025, the Chromium team is not confident that
    // the included video is stable enough for production use.
    if (removeVideo) {
        const videoTracks = stream.getVideoTracks();
        videoTracks.forEach(track => {
            track.stop();
            stream.removeTrack(track);
        });
    }
    await electron_1.ipcRenderer.invoke(config_js_1.ipcEvents.disableLoopbackAudio);
    return stream;
};
exports.getLoopbackAudioMediaStream = getLoopbackAudioMediaStream;
//# sourceMappingURL=renderer.js.map