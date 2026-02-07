import { PodcastEpisode } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getPodcastEpisodes = async (podcastId: string): Promise<PodcastEpisode[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    try {
        const { data, error } = await supabase
            .from('podcast_episodes')
            .select('*')
            .eq('podcast_id', podcastId);

        if (error) {
            console.error('Error fetching podcast episodes:', error);
            return [];
        }

        if (!data) {
            console.warn('No data returned for podcast episodes');
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

export default getPodcastEpisodes;