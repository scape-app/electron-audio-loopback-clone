"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFeatureFlags = exports.loopbackAudioTypes = exports.featureSwitchKey = exports.defaultSourcesOptions = exports.ipcEvents = void 0;
exports.ipcEvents = {
    enableLoopbackAudio: 'enable-loopback-audio',
    disableLoopbackAudio: 'disable-loopback-audio',
};
exports.defaultSourcesOptions = { types: ['screen'] };
exports.featureSwitchKey = 'enable-features';
exports.loopbackAudioTypes = {
    loopback: 'loopback',
    loopbackWithMute: 'loopbackWithMute',
};
const defaultFeatureFlags = {
    pulseaudioLoopbackForScreenShare: 'PulseaudioLoopbackForScreenShare',
    macLoopbackAudioForScreenShare: 'MacLoopbackAudioForScreenShare',
};
// Note: The MacCatapSystemAudioLoopbackCapture flag is expired in modern Chromium.
// Core Audio Taps is now the default when only MacLoopbackAudioForScreenShare is set.
const screenCaptureKitFeatureFlags = {
    macScreenCaptureKitSystemAudioLoopbackOverride: 'MacSckSystemAudioLoopbackOverride',
};
const buildFeatureFlags = ({ otherEnabledFeatures, forceCoreAudioTap, }) => {
    const featureFlags = [...Object.values(defaultFeatureFlags), ...(otherEnabledFeatures ?? [])];
    // On macOS 14.2+, Chromium uses Core Audio Taps by default when only
    // MacLoopbackAudioForScreenShare is set. We don't need to add the
    // MacCatapSystemAudioLoopbackCapture flag (which is expired/broken).
    // Only add ScreenCaptureKit flag when explicitly NOT using Core Audio Taps.
    if (!forceCoreAudioTap) {
        featureFlags.push(screenCaptureKitFeatureFlags.macScreenCaptureKitSystemAudioLoopbackOverride);
    }
    // When forceCoreAudioTap is true (or auto-detected on macOS 14.2+),
    // we just use MacLoopbackAudioForScreenShare alone - Chromium will
    // automatically use Core Audio Taps as the default implementation.
    return featureFlags.join(',');
};
exports.buildFeatureFlags = buildFeatureFlags;
//# sourceMappingURL=config.js.map