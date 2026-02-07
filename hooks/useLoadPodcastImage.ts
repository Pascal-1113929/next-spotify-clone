import { useSupabaseClient } from "@supabase/auth-helpers-react";

import { Podcast } from "@/types";

const useLoadPodcastImage = (podcast: Podcast | null) => {
    const supabaseClient = useSupabaseClient();

    if (!podcast) {
        return null;
    }

    const { data: imageData } = supabaseClient
    .storage
    .from('images')
    .getPublicUrl(podcast.image_path);

    return imageData.publicUrl;
}

export default useLoadPodcastImage;