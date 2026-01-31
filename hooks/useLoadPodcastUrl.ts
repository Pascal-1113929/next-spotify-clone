import { Song } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";

const useLoadPodcastUrl = (chunkPaths: string[]) => {
    const supabaseClient = useSupabaseClient();

    if (!chunkPaths || chunkPaths.length === 0) {
        return [];
    }

    const chunkUrls = chunkPaths.map((chunkPath) => {
        const { data: chunkData } = supabaseClient
            .storage
            .from('podcasts')
            .getPublicUrl(chunkPath);

        return chunkData?.publicUrl || '';
    });

    return chunkUrls;
};

export default useLoadPodcastUrl;