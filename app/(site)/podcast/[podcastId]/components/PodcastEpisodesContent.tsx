"use client"

import PodcastEpisodesItem from "./PodcastEpisodeItem";
import useOnPlay from "@/hooks/useOnPlay";
import { Podcast, PodcastEpisode } from "@/types";

interface PodcastEpisodesContentProps {
    podcastEpisodes: PodcastEpisode[];
    podcast: Podcast;
    userId: string | undefined;
}

const PodcastEpisodesContent: React.FC<PodcastEpisodesContentProps> = ({
    podcastEpisodes,
    podcast,
    userId
}) => {
    // const onPlay = useOnPlay(podcastEpisodes);

    if (podcastEpisodes.length === 0) {
        return (
            <div className="mt-4 text-neutral-400">
                No Podcast Episodes Available
            </div>
        )
    }
    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            <h2 className="sm:text-lg lg:text-2xl font-bold">Episodes</h2>
            {podcastEpisodes.map((item) => (
                <div key={item.id}
                    className="flex items-center gap-x-4 w-full"
                >
                    <PodcastEpisodesItem
                        podcast={podcast}
                        onClick={(id: string) => { console.log(id) }}
                        data={item}
                        isOwner={item.user_id === userId}
                    />
                </div>
            ))}
        </div>
    );
}

export default PodcastEpisodesContent;