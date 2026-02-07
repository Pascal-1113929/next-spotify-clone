"use client"

import { Song } from "@/types";
import useLoadImage from "@/hooks/useLoadImage";
import Image from "next/image";
import PlayButton from "./PlayButton";
import { twMerge } from "tailwind-merge";
import usePlayer from "@/hooks/usePlayer";
import * as ContextMenu from "@radix-ui/react-context-menu";
import SongRightClickContent from "./right_click/SongRightClickContent";

interface SongItemProps {
    data: Song;
    onClick: (id: string) => void;
    isOwner: boolean;
    // playing?: boolean;
}

const SongItem: React.FC<SongItemProps> = ({
    data,
    onClick,
    isOwner,
    // playing = false,
}) => {
    const imagePath = useLoadImage(data);

    const songId = data.id;
    const { activateId } = usePlayer();

    const playing = songId === activateId;

    return (
        <ContextMenu.Root modal={false}>
            <ContextMenu.Trigger>
                <div
                    onClick={() => onClick(data.id)}
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
                // w-[10vw]
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
                        <p className={twMerge("font-semibold truncate w-full", playing && "text-green-500")}>
                            {data.title}
                        </p>
                        <p className="text-neutral-400 text-sm pb-4 w-full truncate">
                            By: {data.author}
                        </p>
                    </div>
                    <div
                        className='
                    absolute 
                    bottom-24 
                    right-5
                    '
                    >
                        <PlayButton />
                    </div>
                </div>
            </ContextMenu.Trigger>
            <SongRightClickContent isOwner={isOwner} song={data} />
        </ContextMenu.Root>
    );
}

export default SongItem;