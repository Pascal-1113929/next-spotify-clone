import { Podcast } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";

const getFollowingPodcasts = async (): Promise<Podcast[]> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    const { data: followData, error: followError } = await supabase
        .from('podcast_follows')
        .select('podcast_id')
        .eq('user_id', session?.user.id);

    if (followError) {
        console.error(followError);
        return [];
    }

    const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .in('id', followData.map((follow: any) => follow.podcast_id))
        .order('created_at', { ascending: false });

    if (error) {
        console.error(error);
    }

    return (data as any) || [];
}

export default getFollowingPodcasts;