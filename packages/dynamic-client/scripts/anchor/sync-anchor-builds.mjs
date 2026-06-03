import { syncAnchorBuilds } from './anchor-build-sync-module.mjs';

try {
    const dumpsPath = syncAnchorBuilds();
    console.log(`Wrote ${dumpsPath}`);
} catch (error) {
    console.error(
        `[sync-anchor-builds] Failed to sync anchor builds: ${error instanceof Error ? error.message : String(error)}`,
    );
    process.exitCode = 1;
}
