import React from "react";
import getPodcast from "@/actions/getPodcast";
import Header from "@/components/Header";
import { getImage } from "@/lib/getImage";
import Image from "next/image";
import getPodcastEpisodes from "@/actions/getPodcastEpisodes";
import getUser from "@/actions/getUser";
import FollowButton from "./components/FollowButton";
import getPodcastTags from "@/actions/getPodcastTags";
import TagButton from "./components/TagButton";
import PodcastPopover from "./components/PodcastPopover";

export const revalidate = 0;

type Props = {
    params: {
        podcastId: string;
    };
}

const PodcastPage = async ({ params }: Props) => {
    const user = await getUser();
    const podcastId = params.podcastId;
    const podcast = await getPodcast(podcastId);
    const imagePath = await getImage(podcast.image_path);
    const tags = await getPodcastTags(podcastId);
    const episodes = await getPodcastEpisodes(podcastId);

    return (
        <div
            className="
        bg-neutral-900
        rounded-lg
        h-full
        w-full
        overflow-hidden
        overflow-y-auto
        "
        >
            <Header>
                <div
                    className="mt-20"
                >
                    <div
                        className="
                    flex
                    flex-col
                    md:flex-row
                    gap-x-5
                    "
                    >
                        <div className="relative h-32 w-32 lg:h-44 lg:w-44 flex flex-shrink-0 min-w-[8rem] lg:min-w-[11rem]">
                            <Image
                                fill
                                alt="Podcast"
                                className="object-cover"
                                src={imagePath || '/images/liked.png'}
                            />
                        </div>
                        <div
                            className="
                        flex
                        flex-col
                        gap-y-2
                        mt-4
                        md:mt-0
                        "
                        >
                            <p className="hudden md:block font-semibold text-sm">Podcast</p>
                            <h1 className="
                            text-white
                            text-4xl
                            sm:text-5xl
                            lg:text-7xl
                            font-bold
                            ">
                                {podcast.name}
                            </h1>
                            <p className="text-sm font-bold">
                                {podcast.subtitle}
                            </p>

                        </div>
                    </div>
                </div>
                <div className="my-16 flex flex-row items-center gap-x-4">
                    <FollowButton isFollowing={podcast.isFollowed} user_id={user?.id} podcast_id={podcastId} />
                    <PodcastPopover podcastId={podcastId} podcast={podcast} isOwner={podcast.user_id === user?.id} />
                </div>
                {/* TODO: Add the ... */}
            </Header>
            <div className="flex flex-col-reverse lg:flex-row gap-4 p-4 w-full">
                <div className="w-full lg:w-2/3 ">
                    <div className="w-full">
                        <p className="text-center">
                            Episodes Here
                            {episodes.map((episode) => (
                                <div key={episode.id}>
                                    {JSON.stringify(episode)}
                                </div>
                            ))}
                        </p>
                    </div>
                </div>
                <div className="w-full lg:w-1/3">
                    <div className="w-full">
                        <h2 className="sm:text-lg lg:text-2xl font-bold">About</h2>
                        <p className="mt-2">
                            {podcast.description}
                        </p>
                        <div className="w-full h-[20px]" />
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <div key={tag.id}>
                                    <TagButton tag={tag} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PodcastPage;