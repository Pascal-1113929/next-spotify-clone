import { Podcast } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import getPodcasts from "./getPodcasts";

const getPodcastsByTitle = async (title: string): Promise<Podcast[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    if (!title)
    {
        const allPodcasts = await getPodcasts();
        return allPodcasts;
    }

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    const { data, error } = await supabase
    .from('podcasts')
    .select('*')
    .like('name', `%${title}%`)
    .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
    }

    const podcastData = await Promise.all(data?.map(async (podcast: Podcast) => {
        const { data: FollowData, error: FollowError } = await supabase
            .from('podcast_follows')
            .select('*')
            .eq('podcast_id', podcast.id)
            .eq('user_id', session?.user.id);

        if (FollowError) {
            console.error(FollowError);
            return podcast;
        }

        if (FollowData && FollowData.length > 0) {
            return {
                ...podcast,
                isFollowed: true
            }
        }

        return podcast;
    }) || []);

    return podcastData;
}

export default getPodcastsByTitle;