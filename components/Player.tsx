"use client"

import useGetSongById from "@/hooks/useGetSongById";
import useLoadSong from "@/hooks/useLoadSongUrl";
import usePlayer from "@/hooks/usePlayer";
import PlayerContent from "./PlayerContect";
import PlayerContentPodcast from "./PlayerContectPodcast";

const Player = () => {
    const player = usePlayer();
    const { song } = useGetSongById(player.activateId);

    const songUrl = useLoadSong(song!);

    if (!song || !songUrl || !player.activateId) {
        return null;
    }

    return (
        <div
            className="
        fixed
        bottom-0
        bg-black
        w-full
        py-2
        md:h-[80px]
        h-[90px]
        px-4
        "
        >
            {player.type === "song" && (
                <PlayerContent
                    key={songUrl}
                    song={song}
                    songUrl={songUrl}
                />
            )} 
            {player.type === "podcast" && (
                <PlayerContentPodcast
                    key={songUrl}
                    podcastEpisode={song}
                    podcastEpisodeUrl={songUrl}
                />
            )}
        </div>
    );
}

export default Player;