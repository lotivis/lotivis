const DebugLogging = true;
export function debug(message) {
    if (!DebugLogging) {
        return;
    }
    console.log(message);
}