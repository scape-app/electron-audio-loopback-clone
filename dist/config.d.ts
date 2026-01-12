import { type SourcesOptions } from 'electron/main';
export declare const ipcEvents: {
    readonly enableLoopbackAudio: "enable-loopback-audio";
    readonly disableLoopbackAudio: "disable-loopback-audio";
};
export declare const defaultSourcesOptions: SourcesOptions;
export declare const featureSwitchKey: "enable-features";
export declare const loopbackAudioTypes: {
    readonly loopback: "loopback";
    readonly loopbackWithMute: "loopbackWithMute";
};
export declare const buildFeatureFlags: ({ otherEnabledFeatures, forceCoreAudioTap, }: {
    otherEnabledFeatures?: string[];
    forceCoreAudioTap?: boolean;
}) => string;
//# sourceMappingURL=config.d.ts.map