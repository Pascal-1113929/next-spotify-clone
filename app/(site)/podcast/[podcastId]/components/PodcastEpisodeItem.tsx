"use client";

import { Podcast, PodcastEpisode } from "@/types";
import Image from "next/image";
import PlayButton from "@/components/PlayButton";
import { twMerge } from "tailwind-merge";
import usePlayer from "@/hooks/usePlayer";
import * as ContextMenu from "@radix-ui/react-context-menu";
import useLoadPodcastImage from "@/hooks/useLoadPodcastImage";

interface PodcastEpisodeItemProps {
    data: PodcastEpisode;
    podcast: Podcast;
    isplayer?: boolean;
    onClick: (id: string) => void;
    isOwner: boolean;
}

const PodcastEpisodeItem: React.FC<PodcastEpisodeItemProps> = ({
    data,
    podcast,
    isplayer,
    onClick,
    isOwner,
}) => {
    const player = usePlayer();
    const imageUrl = useLoadPodcastImage(podcast);

    const songId = data.id;
    const { activateId } = usePlayer();

    const playing = songId === activateId && !isplayer;

    const date_created = new Date(data.created_at).toLocaleDateString("nl-NL", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    })

    const handleClick = () => {
        if (onClick) {
            onClick(data.id);
        }

        return player.setId(data.id, "podcast");
    }

    if (isplayer) {
        return (
            <div
                onClick={handleClick}
                className="
flex
items-center
gap-x-3
cursor-pointer
hover:bg-neutral-800/50
w-full
p-2
rounded-md
"
            >
                <div
                    className="
    relative
    rounded-md
    min-h-[48px]
    min-w-[48px]

    "
                >
                    <Image
                        fill
                        src={imageUrl || "/images/liked.png"}
                        alt="mediaItem"
                        className="object-cover"
                    />
                </div>
                <div className="flex flex-col gap-y-1 overflow-hidden">
                    <p className={twMerge("text-white truncate", playing && "text-green-500")}>{data.episode_number} - {data.name}</p>
                    <p className="text-neutral-400 text-sm truncate">{podcast.name}</p>
                    <br />
                    <p className="text-neutral-400 text-sm">{data.episode_description}</p>
                </div>
            </div>
        )
    }

    return (
        <ContextMenu.Root modal={false}>
            <ContextMenu.Trigger asChild>
                <div
                    onClick={handleClick}
                    className="
                    flex
                    items-center
                    gap-x-3
                    cursor-pointer
                    hover:bg-neutral-800/50
                    w-full
                    p-2
                    rounded-md
                    "
                >
                    <div
                        className="
                        relative
                        rounded-md
                        min-h-[140px]
                        min-w-[140px]
                        "
                    >
                        <Image
                            fill
                            src={imageUrl || "/images/liked.png"}
                            alt="mediaItem"
                            className="object-cover"
                        />
                    </div>
                    <div className="flex flex-col gap-y-1 overflow-hidden">
                        <h3 className={twMerge("text-white truncate sm:text-md lg:text-xl", playing && "text-green-500")}>{data.episode_number} - {data.name}</h3>
                        <p className="text-neutral-400 text-sm truncate">{podcast.name}</p>
                        <p className="text-neutral-400 text-sm mt-2 line-clamp-2">{data.episode_description}</p>
                        <p className=" text-sm mt-2">{date_created}</p>
                    </div>
                </div>
            </ContextMenu.Trigger>
            {/* <SongRightClickContent isOwner={isOwner} song={data} /> */}
        </ContextMenu.Root>
    );
}

export default PodcastEpisodeItem;