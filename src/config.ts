import { type SourcesOptions } from 'electron/main';

export const ipcEvents = {
    enableLoopbackAudio: 'enable-loopback-audio',
    disableLoopbackAudio: 'disable-loopback-audio',
} as const;

export const defaultSourcesOptions: SourcesOptions = { types: ['screen'] };

export const featureSwitchKey = 'enable-features' as const;

export const loopbackAudioTypes = {
    loopback: 'loopback',
    loopbackWithMute: 'loopbackWithMute',
} as const;

const defaultFeatureFlags = {
    pulseaudioLoopbackForScreenShare: 'PulseaudioLoopbackForScreenShare',
    macLoopbackAudioForScreenShare: 'MacLoopbackAudioForScreenShare',
} as const;

// Note: The MacCatapSystemAudioLoopbackCapture flag is expired in modern Chromium.
// Core Audio Taps is now the default when only MacLoopbackAudioForScreenShare is set.

const screenCaptureKitFeatureFlags = {
    macScreenCaptureKitSystemAudioLoopbackOverride: 'MacSckSystemAudioLoopbackOverride',
} as const;

export const buildFeatureFlags = ({
    otherEnabledFeatures,
    forceCoreAudioTap,
}: {
    otherEnabledFeatures?: string[];
    forceCoreAudioTap?: boolean;
}): string => {
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
