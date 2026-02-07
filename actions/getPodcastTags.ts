import { PodcastTag } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getPodcastTags = async (podcastId: string): Promise<PodcastTag[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    try {
        const { data, error } = await supabase
            .from('podcast_has_tags')
            .select('*')
            .eq('podcast_id', podcastId);

        if (error) {
            console.error('Error fetching podcast tags:', error);
            return [];
        }

        if (!data) {
            console.warn('No data returned for podcast tags');
            return [];
        }

        const { data: tags, error: tagError } = await supabase
            .from('podcast_tags')
            .select('*')
            .in('id', data.map((item) => item.tag_id));

        if (tagError) {
            console.error('Error fetching tags:', tagError);
            return [];
        }

        return tags;

    } catch (err) {
        console.error('Fetch failed:', err);
        return [];
    }
}

export default getPodcastTags;