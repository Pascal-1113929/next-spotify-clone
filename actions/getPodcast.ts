import { Podcast } from "@/types";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getPodcast = async (id: string): Promise<Podcast> => {
    const supabase = createServerComponentClient({
        cookies: cookies
    });

    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();

    const { data, error } = await supabase
        .from('podcasts')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(error);
        throw new Error("Error fetching podcast.");
    }

    if (!data) {
        throw new Error("Podcast not found.");
    }

    const { data: FollowData, error: FollowError } = await supabase
        .from('podcast_follows')
        .select('*')
        .eq('podcast_id', data.id)
        .eq('user_id', session?.user.id);

    if (FollowError) {
        console.error(FollowError);
    }

    if (FollowData && FollowData.length > 0) {
        return {
            ...data,
            isFollowed: true
        };
    }

    return data;
}

export default getPodcast;