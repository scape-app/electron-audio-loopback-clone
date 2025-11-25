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
const coreAudioTapFeatureFlags = {
    macCoreAudioTapSystemAudioLoopbackOverride: 'MacCatapSystemAudioLoopbackCapture',
};
const screenCaptureKitFeatureFlags = {
    macScreenCaptureKitSystemAudioLoopbackOverride: 'MacSckSystemAudioLoopbackOverride',
};
const buildFeatureFlags = ({ otherEnabledFeatures, forceCoreAudioTap, }) => {
    const featureFlags = [...Object.values(defaultFeatureFlags), ...(otherEnabledFeatures ?? [])];
    if (forceCoreAudioTap) {
        featureFlags.push(coreAudioTapFeatureFlags.macCoreAudioTapSystemAudioLoopbackOverride);
    }
    else {
        featureFlags.push(screenCaptureKitFeatureFlags.macScreenCaptureKitSystemAudioLoopbackOverride);
    }
    return featureFlags.join(',');
};
exports.buildFeatureFlags = buildFeatureFlags;
//# sourceMappingURL=config.js.map