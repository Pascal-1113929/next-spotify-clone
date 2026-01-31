export const getPodcastAudioDuration = (
    url: string[],
    callback: (formattedDuration: string | null, error?: string) => void
): void => {
    let totalDuration = 0;
    let loadedCount = 0;

    for (const singleUrl of url) {
        const audio = new Audio(singleUrl);
        audio.addEventListener('loadedmetadata', () => {
            totalDuration += audio.duration;
            loadedCount++;

            if (loadedCount === url.length) {
                const minutes = Math.floor(totalDuration / 60);
                const seconds = Math.floor(totalDuration % 60);
                const formattedDuration = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                callback(formattedDuration);
            }
        });

        audio.addEventListener('error', (e) => {
            callback(null, `Failed to load audio: ${e.message}`);
        });
    }
};

export const getPodcastAudioDurationInSeconds = (
    url: string[],
    callback: (durationInSeconds: number | null, error?: string) => void
): void => {
    let totalDuration = 0;
    let loadedCount = 0;

    for (const singleUrl of url) {
        const audio = new Audio(singleUrl);
        audio.addEventListener('loadedmetadata', () => {
            totalDuration += audio.duration;
            loadedCount++;

            if (loadedCount === url.length) {
                callback(totalDuration);
            }
        });

        audio.addEventListener('error', (e) => {
            callback(null, `Failed to load audio: ${e.message}`);
        });
    }
};