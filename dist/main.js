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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.initMain = void 0;
const electron_1 = require("electron");
const os = __importStar(require("os"));
const config_js_1 = require("./config.js");
/**
 * Checks if Core Audio Taps are available on the current macOS version.
 * Core Audio Taps are available on macOS 14.2+ and should be preferred over
 * ScreenCaptureKit because ScreenCaptureKit can interfere with system keyboard
 * shortcuts and global hotkeys (e.g., Raycast).
 *
 * Darwin kernel version mapping:
 * - macOS 15.x = Darwin 24.x
 * - macOS 14.x = Darwin 23.x
 * - macOS 13.x = Darwin 22.x
 * - macOS 12.x = Darwin 21.x
 */
const shouldUseCoreAudioTaps = () => {
    if (process.platform !== 'darwin') {
        return false;
    }
    try {
        const release = os.release();
        const [majorStr, minorStr] = release.split('.');
        const major = parseInt(majorStr, 10);
        const minor = parseInt(minorStr, 10);
        // Core Audio Taps available on macOS 14.2+ (Darwin 23.2+)
        // We use this by default to avoid ScreenCaptureKit's keyboard shortcut issues
        if (major > 23) {
            return true; // macOS 15+
        }
        if (major === 23 && minor >= 2) {
            return true; // macOS 14.2+
        }
        return false;
    }
    catch {
        return false;
    }
};
const initMain = (options = {}) => {
    const { forceCoreAudioTap, loopbackWithMute = false, onAfterGetSources, sessionOverride, sourcesOptions = config_js_1.defaultSourcesOptions, } = options;
    // Use Core Audio Taps by default on macOS 14.2+ to avoid ScreenCaptureKit's
    // interference with system keyboard shortcuts (Raycast, global hotkeys, etc.)
    const useCoreAudioTap = forceCoreAudioTap ?? shouldUseCoreAudioTaps();
    // Get other enabled features from the command line.
    const otherEnabledFeatures = electron_1.app.commandLine.getSwitchValue(config_js_1.featureSwitchKey)?.split(',');
    // Remove the switch if it exists.
    if (electron_1.app.commandLine.hasSwitch(config_js_1.featureSwitchKey)) {
        electron_1.app.commandLine.removeSwitch(config_js_1.featureSwitchKey);
    }
    // Add the feature flags to the command line with any other user-enabled features concatenated.
    const currentFeatureFlags = (0, config_js_1.buildFeatureFlags)({
        otherEnabledFeatures,
        forceCoreAudioTap: useCoreAudioTap,
    });
    electron_1.app.commandLine.appendSwitch(config_js_1.featureSwitchKey, currentFeatureFlags);
    // Handle the enable loopback audio event.
    electron_1.ipcMain.handle(config_js_1.ipcEvents.enableLoopbackAudio, () => {
        const session = sessionOverride || electron_1.session.defaultSession;
        session.setDisplayMediaRequestHandler(async (_, callback) => {
            let sources;
            try {
                sources = await electron_1.desktopCapturer.getSources(sourcesOptions);
                // If the developer needs to transform the sources and return a single-item array,
                // they can do so by passing a function to the `onAfterGetSources` option.
                // Likely this will be unused, but who knows?!
                if (onAfterGetSources) {
                    sources = onAfterGetSources(sources);
                }
            }
            catch {
                throw new Error(`Failed to get sources for system audio loopback capture.`);
            }
            if (sources.length === 0) {
                throw new Error(`No sources found for system audio loopback capture.`);
            }
            callback({
                video: sources[0],
                audio: loopbackWithMute ? config_js_1.loopbackAudioTypes.loopbackWithMute : config_js_1.loopbackAudioTypes.loopback,
            });
        });
    });
    // Handle the disable loopback audio event.
    electron_1.ipcMain.handle(config_js_1.ipcEvents.disableLoopbackAudio, () => {
        const session = sessionOverride || electron_1.session.defaultSession;
        session.setDisplayMediaRequestHandler(null);
    });
};
exports.initMain = initMain;
//# sourceMappingURL=main.js.map