"use client";

import { Song } from "@/types";
import useLoadImage from "@/hooks/useLoadImage";
import usePlayer from "@/hooks/usePlayer";
import Image from "next/image";
import { twMerge } from "tailwind-merge";
import * as ContextMenu from "@radix-ui/react-context-menu";
import SongRightClickContent from "./right_click/SongRightClickContent";
import useGetAlbumName from "@/hooks/useGetAlbumName";

interface MediaItemProps {
    data: Song;
    onClick?: (id: string) => void;
    isplayer?: boolean;
    isOwner: boolean;
    hasAlbumName?: boolean;
}

const MediaItem: React.FC<MediaItemProps> = ({
    data,
    onClick,
    isplayer,
    isOwner,
    hasAlbumName = false
}) => {
    const player = usePlayer();
    const imageUrl = useLoadImage(data);

    const songId = data.id;
    const { activateId } = usePlayer();

    const playing = songId === activateId && !isplayer;

    const { albumName } = useGetAlbumName(data.album_id);

    const handleClick = () => {
        if (onClick) {
            onClick(data.id);
        }

        return player.setId(data.id, "song");
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
                    <p className={twMerge("text-white truncate", playing && "text-green-500")}>{data.title}</p>
                    <p className="text-neutral-400 text-sm truncate">{data.author}</p>
                </div>
            </div>
        )
    }

    return (
        <ContextMenu.Root modal={false}>
            <ContextMenu.Trigger>
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
                        <p className={twMerge("text-white truncate", playing && "text-green-500")}>{data.title}</p>
                        <p className="text-neutral-400 text-sm truncate">{data.author}</p>
                        {hasAlbumName && albumName && <p className="text-neutral-400 text-sm truncate">{albumName}</p>}
                    </div>
                </div>
            </ContextMenu.Trigger>
            <SongRightClickContent isOwner={isOwner} song={data} />
        </ContextMenu.Root>
    );
}

export default MediaItem;