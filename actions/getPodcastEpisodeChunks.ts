import { PodcastEpisode } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getPodcastEpisodeChunks = async (episodeId: string): Promise<PodcastEpisode[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    try {
        const { data, error } = await supabase
            .from('podcast_episode_chunks')
            .select('*')
            .eq('episode_id', episodeId);
        if (error) {
            console.error('Error fetching podcast episode chunks:', error);
            return [];
        }

        if (!data) {
            console.warn('No data returned for podcast episode chunks');
            return [];
        }

        return data.map((item) => ({
            ...item,
        }));
    } catch (err) {
        console.error('Fetch failed:', err);
        return [];
    }
}

export default getPodcastEpisodeChunks;