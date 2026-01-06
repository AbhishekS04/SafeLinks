
export function getSafeHostname(url: string | null | undefined): string {
    if (!url) return "unknown";

    try {
        // Try parsing as is
        return new URL(url).hostname;
    } catch (e) {
        try {
            // Try with https prefix if it failed
            if (!url.startsWith('http')) {
                return new URL(`https://${url}`).hostname;
            }
            return url; // Return raw if still fails but let's be safer
        } catch (e2) {
            return url.split('/')[0] || "invalid url";
        }
    }
}
