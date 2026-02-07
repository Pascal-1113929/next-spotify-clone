"use client"

import { Podcast } from "@/types";
import Image from "next/image";
// import PlayButton from "./PlayButton";
import { twMerge } from "tailwind-merge";
import usePlayer from "@/hooks/usePlayer";
import useLoadPodcastImage from "@/hooks/useLoadPodcastImage";
import Link from "next/link";
import * as ContextMenu from "@radix-ui/react-context-menu";
import PodcastRightClickContent from "./right_click/PodcastRightClickContent";

interface PodcastItemProps {
    data: Podcast;
    isOwner: boolean;
}

const PodcastItem: React.FC<PodcastItemProps> = ({
    data,
    isOwner,
}) => {
    const imagePath = useLoadPodcastImage(data);

    const podcastId = data.id;
    const { activateId } = usePlayer();

    const playing = podcastId === activateId;

    return (
        <ContextMenu.Root modal={false}>
            <ContextMenu.Trigger>
                <Link href={`/podcast/${podcastId}`}>
                    <div
                        className="relative
        group
        flex
        flex-col
        items-center
        justify-center
        rounded-md
        overflow-hidden
        gap-x-4
        bg-neutral-400/5
        cursor-pointer
        hover:bg-neutral-400/10
        transition
        p-3
        "
                    >
                        <div className="relative aspect-square w-full h-full rounded-md overflow-hidden">
                            <Image
                                className="object-cover"
                                src={imagePath || '/images/liked.png'}
                                fill
                                alt="Image"
                            />
                        </div>
                        <div className="flex flex-col items-start w-full pt-4 gap-y-1">
                            <p className={twMerge("font-semibold truncate w-full", playing && "text-green-500")} title={data.name}>
                                {data.name}
                            </p>
                            <p className="text-neutral-400 text-sm w-full truncate">
                                {data.description}
                            </p>
                            <p className="text-neutral-400 text-sm pb-2 w-full truncate" title={data.author}>
                                By {data.author}
                            </p>
                        </div>
                        {/* <div
                className='
          absolute 
          bottom-24 
          right-5
        '
            >
                <PlayButton />
            </div> */}
                    </div>
                </Link>
            </ContextMenu.Trigger>
            <PodcastRightClickContent isOwner={isOwner} podcast={data} />
        </ContextMenu.Root>
    );
}

export default PodcastItem;