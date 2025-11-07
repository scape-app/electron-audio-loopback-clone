import { app, session as sessionModule, desktopCapturer, ipcMain } from 'electron';
import { type DesktopCapturerSource } from 'electron/main';
import { buildFeatureFlags, ipcEvents, defaultSourcesOptions, featureSwitchKey, loopbackAudioTypes } from './config.js';
import { type InitMainOptions } from './types.js';

export const initMain = (options: InitMainOptions = {}): void => {
    const {
        forceCoreAudioTap = true, // Default to CoreAudio taps to avoid ScreenCaptureKit keyboard interference
        loopbackWithMute = false,
        onAfterGetSources,
        sessionOverride,
        sourcesOptions = defaultSourcesOptions,
    } = options;

    // Get other enabled features from the command line.
    const otherEnabledFeatures = app.commandLine.getSwitchValue(featureSwitchKey)?.split(',');

    // Remove the switch if it exists.
    if (app.commandLine.hasSwitch(featureSwitchKey)) {
        app.commandLine.removeSwitch(featureSwitchKey);
    }

    // Add the feature flags to the command line with any other user-enabled features concatenated.
    const currentFeatureFlags = buildFeatureFlags({
        otherEnabledFeatures,
        forceCoreAudioTap,
    });

    app.commandLine.appendSwitch(featureSwitchKey, currentFeatureFlags);

    // Handle the enable loopback audio event.
    ipcMain.handle(ipcEvents.enableLoopbackAudio, () => {
        const session = sessionOverride || sessionModule.defaultSession;

        session.setDisplayMediaRequestHandler(async (_, callback) => {
            let sources: DesktopCapturerSource[];

            try {
                sources = await desktopCapturer.getSources(sourcesOptions);

                // If the developer needs to transform the sources and return a single-item array,
                // they can do so by passing a function to the `onAfterGetSources` option.
                // Likely this will be unused, but who knows?!
                if (onAfterGetSources) {
                    sources = onAfterGetSources(sources);
                }
            } catch {
                throw new Error(`Failed to get sources for system audio loopback capture.`);
            }

            if (sources.length === 0) {
                throw new Error(`No sources found for system audio loopback capture.`);
            }

            callback({
                video: sources[0],
                audio: loopbackWithMute ? loopbackAudioTypes.loopbackWithMute : loopbackAudioTypes.loopback,
            });
        });
    });

    // Handle the disable loopback audio event.
    ipcMain.handle(ipcEvents.disableLoopbackAudio, () => {
        const session = sessionOverride || sessionModule.defaultSession;
        session.setDisplayMediaRequestHandler(null);
    });
}
