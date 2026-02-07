import { PodcastEpisode, PodcastEpisodeChunk, PodcastEpisodeWithChunks } from "@/types";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

const useGetPodcastEpisodeById = (id?: string) => {
    const [isLoading, setIsLoading] = useState(false);
    const [podcastEpisode, setPodcastEpisode] = useState<PodcastEpisode | undefined>();
    const [podcastEpisodeChunks, setPodcastEpisodeChunks] = useState<PodcastEpisodeChunk[] | []>([]);
    const [podcastEpisodeWithChunks, setPodcastEpisodeWithChunks] = useState<PodcastEpisodeWithChunks | undefined>();

    const { supabaseClient } = useSessionContext();

    useEffect(() => {
        if (!id) {
            return;
        }

        setIsLoading(true);

        const fetchPodcastEpisode = async () => {
            const { data, error } = await supabaseClient
                .from('podcast_episodes')
                .select('*')
                .eq('id', id)
                .single();

            if (error) {
                toast.error(error.message);
                return null;
            }

            return data as PodcastEpisode;
        };

        const fetchPodcastEpisodeChunks = async () => {
            const { data, error } = await supabaseClient
                .from('podcast_episode_chunks')
                .select('*')
                .eq('episode_id', id)
                .order('id', { ascending: true });

            if (error) {
                toast.error(error.message);
                return [];
            }

            return data as PodcastEpisodeChunk[];
        };

        const fetchData = async () => {
            const [episode, chunks] = await Promise.all([
                fetchPodcastEpisode(),
                fetchPodcastEpisodeChunks(),
            ]);

            if (episode) {
                setPodcastEpisode(episode);
            }
            if (chunks) {
                setPodcastEpisodeChunks(chunks);
            }

            setIsLoading(false);
        };

        fetchData();
    }, [id, supabaseClient]);

    useEffect(() => {
        if (podcastEpisode && podcastEpisodeChunks.length > 0) {
            const combinedData = {
                ...podcastEpisode,
                chunks: podcastEpisodeChunks,
            };
            setPodcastEpisodeWithChunks(combinedData);
        }
    }, [podcastEpisode, podcastEpisodeChunks]);

    return useMemo(() => ({
        isLoading,
        podcastEpisodeWithChunks,
    }), [isLoading, podcastEpisodeWithChunks]);
};

export default useGetPodcastEpisodeById;