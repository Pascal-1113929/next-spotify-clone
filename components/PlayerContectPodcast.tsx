"use client"

import { PodcastEpisode, PodcastEpisodeWithChunks } from "@/types";
import MediaItem from "./MediaItem";
import LikeButton from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerWave, HiSpeakerXMark } from "react-icons/hi2";
import Slider from "./Slider";
import usePlayer from "@/hooks/usePlayer";
import { useEffect, useState } from "react";
import useSound from "use-sound";
import toast from "react-hot-toast";
import { getAudioDuration, getAudioDurationInSecconds } from "@/lib/getDuration";
import PlayerSlider from "./PlayerSlider";
import PlaylistButton from "./PlaylistButton";
import MediaEpisodeItem from "./MediaEpisodeItem";
import Player from "./Player";
import { getPodcastAudioDuration, getPodcastAudioDurationInSeconds } from "@/lib/getPodcastDuration";

interface PlayerContentPodcastProps {
    podcastEpisode: PodcastEpisodeWithChunks;
    podcastEpisodeUrl: string[];
}

const PlayerContentPodcast: React.FC<PlayerContentPodcastProps> = ({
    podcastEpisode,
    podcastEpisodeUrl
}) => {
    const player = usePlayer();
    const [volume, setVolume] = useState<number>(() => {
        const savedVolume = localStorage.getItem('volume');
        return savedVolume ? parseFloat(savedVolume) : 1;
    });
    const [numberVolume, setNumberVolume] = useState(1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState<string | null>(null);
    const [durationInSeconds, setDurationInSeconds] = useState<number | null>(null);
    const [currentTime, setCurrentTime] = useState<string | null>(null);
    const [currentTimeInSeconds, setCurrentTimeInSeconds] = useState<number | null>(null);
    const [currentUrlIndex, setCurrentUrlIndex] = useState(0);
    const [accumulatedDuration, setAccumulatedDuration] = useState(0);
    const [pendingSeek, setPendingSeek] = useState<number>(0);

    const Icon = isPlaying ? BsPauseFill : BsPlayFill;
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

    const handleSeek = (value: number) => {
        // setPendingSeek(value);

        // if (pendingSeek < accumulatedDuration) {
        //     onPartPlayPrev();
        //     handleSeek(value); // Call handleSeek again to check if we need to go back more chunks
        // }
        // else if (pendingSeek >= accumulatedDuration + (sound ? sound.duration() : 0)) {
        //     onPartPlayNext();
        //     handleSeek(value); // Call handleSeek again to check if we need to go forward more chunks
        // }
        // else {
        //     if (sound) {
        //         sound.seek(value);
        //     }
        // }
        console.log("Seeking to:", value);
    };

    const onPlayNext = () => {
        // if (player.ids.length === 0) {
        //     return;
        // }

        // if (player.shuffle)
        // {
        //     const randomIndex = Math.floor(Math.random() * player.ids.length);
        //     const randomPodcastEpisode = player.ids[randomIndex];
        //     return player.setId(randomPodcastEpisode, "podcast");
        // }

        // const currentIndex = player.ids.findIndex((id) => id === player.activateId);

        // const nextPodcastEpisode = player.ids[currentIndex + 1];

        // if (!nextPodcastEpisode) {
        //     return player.setId(player.ids[0], "podcast");
        // }

        // player.setId(nextPodcastEpisode, "podcast");
    }

    const onPlayPrevious = () => {
        // if (player.ids.length === 0) {
        //     return;
        // }

        // const currentIndex = player.ids.findIndex((id) => id === player.activateId);

        // const previousPodcastEpisode = player.ids[currentIndex - 1];

        // if (!previousPodcastEpisode) {
        //     return player.setId(player.ids[player.ids.length - 1], "podcast");
        // }

        // player.setId(previousPodcastEpisode, "podcast");
    }

    const [play, { pause, sound }] = useSound(
        podcastEpisodeUrl[currentUrlIndex], // Use the current URL
        {
            volume,
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false);
                onPartPlayNext(); // Automatically play the next URL when the current one ends
            },
            onpause: () => setIsPlaying(false),
            format: ["mp3"]
        }
    );

    const onPartPlayNext = () => {
        if (currentUrlIndex < podcastEpisodeUrl.length - 1) {
            if (sound) {
                const currentChunkDuration = sound.duration();
                setAccumulatedDuration((prev) => prev + currentChunkDuration);
            }
            setCurrentUrlIndex((prevIndex) => prevIndex + 1);
        } else {
            setIsPlaying(false);
        }
    };

    const onPartPlayPrev = () => {
        if (currentUrlIndex > 0) {
            setCurrentUrlIndex((prevIndex) => prevIndex - 1);
            setAccumulatedDuration((prev) => {
                if (sound) {
                    const currentChunkDuration = sound.duration();
                    return Math.max(0, prev - currentChunkDuration);
                }
                return prev;
            });
        }
    };

    useEffect(() => {
        sound?.play();

        return () => {
            sound?.unload();
        }
    }, [sound,])

    const handlePlay = () => {
        if (!isPlaying) {
            play();
        } else {
            pause();
        }
    }

    const toggleMute = () => {
        if (volume === 0) {
            setVolume(numberVolume);
        } else {
            setVolume(0);
        }
    }

    useEffect(() => {
        if (sound) {
            const interval = setInterval(() => {
                const currentTime = sound.seek(); // Time in current chunk
                const totalTime = accumulatedDuration + currentTime; // Add previous chunks' duration
                const minutes = Math.floor(totalTime / 60);
                const seconds = Math.floor(totalTime % 60);
                const formattedCurrentTime = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
                setCurrentTime(formattedCurrentTime);
                setCurrentTimeInSeconds(totalTime); // Use total time instead of just current chunk time
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [sound, accumulatedDuration]); // Add accumulatedDuration to dependencies

    useEffect(() => {
        getPodcastAudioDuration(podcastEpisodeUrl, (formattedDuration, error) => {
            if (error) {
                toast.error(error);
            } else {
                setDuration(formattedDuration);
            }
        });
        getPodcastAudioDurationInSeconds(podcastEpisodeUrl, (durationInSeconds, error) => {
            if (error) {
                toast.error(error);
            } else {
                setDurationInSeconds(durationInSeconds);
            }
        });
    }, [podcastEpisodeUrl]);

    useEffect(() => {
        localStorage.setItem('volume', volume.toString());
    }, [volume]);

    useEffect(() => {
        setAccumulatedDuration(0);
        setCurrentUrlIndex(0);
    }, [podcastEpisode.id]); // Reset when episode changes

    return (
        <div className="h-full">


            <div
                className="
        grid
        grid-cols-2
        md:grid-cols-3
        grid-rows-1
        h-full
        "
            >
                <div className="flex w-full justify-start">
                    <div className="flex items-center gap-x-4 md:mb-4">
                        <MediaEpisodeItem data={podcastEpisode} isplayer isOwner={false} />
                        {/* <LikeButton podcastId={podcastEpisode.id} />
                        <PlaylistButton podcastId={podcastEpisode.id}/> */}
                    </div>
                </div>
                <div className="flex md:hidden coll-auto w-full justify-end items-center">
                    <div
                        onClick={handlePlay}
                        className="
                h-10
                w-10
                flex
                items-center
                justify-center
                rounded-full
                bg-white
                cursor-pointer
                "
                    >
                        <Icon size={30} className="text-black" />
                    </div>
                </div>
                <div
                    className="
    hidden
    h-full
    md:flex
    flex-col
    justify-center
    items-center
    w-full
    max-w-[722px]
    gap-x-6
    "
                >
                    <div className="flex items-center gap-x-6">
                        <AiFillStepBackward size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" onClick={onPlayPrevious} />
                        <div
                            onClick={handlePlay}
                            className="
            flex
            items-center
            justify-center
            h-10
            w-10
            rounded-full
            bg-white
            p-1
            cursor-pointer
            "
                        >
                            <Icon size={30} className="text-black" />
                        </div>
                        <AiFillStepForward size={30} className="text-neutral-400 cursor-pointer hover:text-white transition" onClick={onPlayNext} />
                        <button onClick={onPartPlayNext}>skip chunk</button>
                    </div>
                    <div className="flex flex-row">
                        <p className="mt-2 text-center">{currentTime}</p>
                        <PlayerSlider duration={durationInSeconds} currentTime={currentTimeInSeconds} onSeek={handleSeek} />
                        <p className="mt-2 text-center">{duration}</p>
                    </div>
                </div>
                <div className="hidden md:flex justify-end pr-2 md:mb-4">
                    <div className="flex items-center gap-x-2 w-[120px]">
                        <VolumeIcon
                            onClick={toggleMute}
                            className="cursor-pointer"
                            size={34}
                        />
                        <Slider
                            value={volume}
                            onChange={(value) => {
                                setVolume(value)
                                setNumberVolume(value)
                            }}
                        />
                    </div>
                </div>
            </div>
            <div className="block md:hidden w-full fixed bottom-0">
                <PlayerSlider duration={durationInSeconds} currentTime={currentTimeInSeconds} onSeek={handleSeek} />
            </div>
        </div>
    );
}

export default PlayerContentPodcast;