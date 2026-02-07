"use client";

import Modal from "../Modal";
import { useEffect, useState } from "react";
import Button from "../Button";
import toast from "react-hot-toast";
import { useUser } from "@/hooks/useUser";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useRouter } from "next/navigation";
import { useDeletePodcastModal } from "@/hooks/useDeletePodcastModal";

const DeletePodcastModal = () => {
    const router = useRouter();
    const deletePodcastModal = useDeletePodcastModal();

    const [isLoading, setIsLoading] = useState(false);

    const { user } = useUser();

    const supabaseClient = useSupabaseClient();

    const podcastId = deletePodcastModal.podcastId;

    const [podcastName, setPodcasttName] = useState(podcastId);

    const fetchPodcastName = async () => {
        try {
            const { data: podcast, error } = await supabaseClient
                .from('podcasts')
                .select('name')
                .eq('id', podcastId)
                .single();

            if (error) {
                console.error("Error fetching podcast name: ", error);
                toast.error("Failed to fetch podcast name");
                return;
            }

            setPodcasttName(podcast?.name);
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        }
    }

    useEffect(() => {
        if (!podcastId) {
            return;
        }

        fetchPodcastName();
    }, [podcastId]);

    const onChange = (open: boolean) => {
        if (!open) {
            deletePodcastModal.onClose();
        }
    }

    const DeletePodcast = async () => {
        try {
            const { data: episodes, error: GetEpisodesError } = await supabaseClient
                .from('podcast_episodes')
                .select('*')
                .eq('podcast_id', podcastId);

            if (GetEpisodesError) {
                console.error("Error fetching episodes: ", GetEpisodesError);
                toast.error("Failed to fetch episodes");
                return;
            }

            console.log(episodes);

            for (const episode of episodes) {
                const { error: SongDeleteError } = await supabaseClient
                    .from('podcast_episodes')
                    .delete()
                    .eq('id', episode.id);

                if (SongDeleteError) {
                    console.error("Error deleting episode: ", SongDeleteError);
                    toast.error("Failed to delete episode");
                    return;
                }

                const { error: StorageDeleteError } = await supabaseClient
                    .storage
                    .from('podcast_episodes')
                    .remove([episode.episode_path]);

                if (StorageDeleteError) {
                    console.error("Error deleting episode from storage: ", StorageDeleteError);
                    toast.error("Failed to delete episode from storage");
                    return;
                }

            }

            // const {  }

            const { data, error: GetPodcastError } = await supabaseClient
                .from('podcasts')
                .select('*')
                .eq('id', podcastId)
                .eq('user_id', user?.id)
                .single();

            if (GetPodcastError || !data) {
                console.error("Error fetching podcast: ", GetPodcastError);
                toast.error("Failed to fetch podcast");
                return;
            }

            const { error: PodcastDeleteError } = await supabaseClient
                .from('podcasts')
                .delete()
                .eq('id', podcastId)
                .eq('user_id', user?.id)

            if (PodcastDeleteError) {
                console.error("Error deleting podcast: ", PodcastDeleteError);
                toast.error("Failed to delete podcast");
                return;
            }

            const { error: ImageDeleteError } = await supabaseClient
                .storage
                .from('images')
                .remove([data.image_patch]);

            if (ImageDeleteError) {
                console.error("Error deleting image: ", ImageDeleteError);
                toast.error("Failed to delete image");
                return;
            }

            toast.success("Podcast deleted successfully");
            router.push('/');
            deletePodcastModal.onClose();
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Modal
            title={`Delete Podcast ${podcastName}`}
            description=""
            isOpen={deletePodcastModal.isOpen}
            onChange={onChange}
        >
            <form className="w-full flex flex-row justify-evenly items-center">
                <Button disabled={isLoading} onClick={DeletePodcast} className="w-[170px]">
                    Delete Podcast
                </Button>
                <Button disabled={isLoading} onClick={() => {
                    deletePodcastModal.onClose()
                }} className="bg-neutral-500 w-[170px]">
                    Cancel
                </Button>
            </form>
        </Modal >
    );
}

export default DeletePodcastModal;