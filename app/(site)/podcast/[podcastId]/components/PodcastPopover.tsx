"use client";

import React from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";

import { FaEllipsisH } from "react-icons/fa";
import { HiOutlineTrash } from "react-icons/hi";
import { useDeletePodcastModal } from "@/hooks/useDeletePodcastModal";
import { useEditPodcastModal } from "@/hooks/useEditPodcastModal";
import JSZip from "jszip";
import toast from "react-hot-toast";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { TbDownload, TbDownloadOff } from "react-icons/tb";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Podcast } from "@/types";
import { useUploadPodcastEpisodeModal } from "@/hooks/useUploadPodcastEpisodeModal";
import { AiOutlineUpload } from "react-icons/ai";

interface PodcastPopoverProps {
    podcastId: string;
    isOwner?: boolean;
    podcast: Podcast
}

const PodcastPopover: React.FC<PodcastPopoverProps> = ({ podcastId, isOwner, podcast }) => {
    const supabaseClient = useSupabaseClient();
    const editPodcastModal = useEditPodcastModal();
    const deletePodcastModal = useDeletePodcastModal();
    const uploadPodcastEpisodeModal = useUploadPodcastEpisodeModal();
    const { subscription } = useUser();

    const handleDeletePodcast = async () => {
        console.log("Delete Podcast");
        deletePodcastModal.onOpen(podcastId);
    }

    const handleDownload = async () => {
        const { data: PsData, error: PsError } = await supabaseClient
            .from('podcast_episodes')
            .select('*')
            .eq('podcast_id', podcast.id);

        if (PsError) {
            console.error('Error fetching podcast songs:', PsError);
            toast.error('Error fetching podcast songs');
            return;
        }

        const zip = new JSZip();
        const folder = zip.folder(podcast.name);

        if (podcast.image_path) {
            const { data: imageData, error: imageError } = await supabaseClient.storage.from('images').download(podcast.image_path);

            if (imageError) {
                console.error('Error downloading podcast image:', imageError);
                toast.error('Error downloading podcast image');
                return;
            }

            if (folder) {
                folder.file(`${podcast.name}.png`, imageData);
            } else {
                console.error('Folder is null');
                toast.error('Folder is not available');
                return;
            }
        }

        for (const episode of PsData) {
            const { data, error } = await supabaseClient.storage.from('podcast_episodes').download(episode.episode_path);

            if (error) {
                console.error('Error downloading file:', error);
                toast.error('Error downloading file');
                return;
            }

            if (folder) {
                folder.file(`#${episode.episode_number} - ${episode.name}.mp3`, data);
            } else {
                console.error('Folder is null');
                toast.error('Folder is not available');
                return;
            }
        }

        const content = await zip.generateAsync({ type: "blob" });
        const url = URL.createObjectURL(content);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${podcast.name}.zip`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        toast.success('Podcast downloaded successfully');
    }

    const handleEditPodcast = async () => {
        editPodcastModal.onOpen(podcastId);
    }

    const handleUploadEpisode = async () => {
        uploadPodcastEpisodeModal.onOpen(podcastId);
    }

    return (
        <div>
            <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                    <button className="flex flex-col justify-center">
                        <FaEllipsisH className="text-neutral-400 hover:text-neutral-300 transition hover:outline-none" size={25} />
                    </button>
                </DropdownMenu.Trigger>

                <DropdownMenu.Portal>
                    <DropdownMenu.Content
                        className="py-2 min-w-[220px] rounded-md bg-neutral-800 p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] will-change-[opacity,transform] data-[side=bottom]:animate-slideUpAndFade data-[side=left]:animate-slideRightAndFade data-[side=right]:animate-slideLeftAndFade data-[side=top]:animate-slideDownAndFade"
                    >
                        {isOwner && (
                            <>
                                <DropdownMenu.Item className="flex flex-row justify-between cursor-pointer focus:outline-none text-neutral-400 hover:text-neutral-300 px-3 transition" onClick={handleDeletePodcast}>
                                    Delete Podcast <HiOutlineTrash size={20} className="text-neutral-400" />
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="flex flex-row justify-between cursor-pointer focus:outline-none text-neutral-400 hover:text-neutral-300 px-3 transition" onClick={handleEditPodcast}>
                                    Edit Podcast <MdOutlineModeEditOutline size={20} className="text-neutral-400" />
                                </DropdownMenu.Item>
                                <DropdownMenu.Item className="flex flex-row justify-between cursor-pointer focus:outline-none text-neutral-400 hover:text-neutral-300 px-3 transition" onClick={handleUploadEpisode} disabled={!subscription}>
                                    <>
                                        Upload Podcast Episode <AiOutlineUpload size={20} className="text-neutral-400" />
                                    </>
                                </DropdownMenu.Item>

                                <DropdownMenu.Separator className="m-[5px] h-px bg-neutral-400" />
                            </>
                        )}

                        <DropdownMenu.Item className="flex flex-row justify-between cursor-pointer focus:outline-none text-neutral-400 hover:text-neutral-300 disabled:text-neutral-600 px-3 transition" onClick={handleDownload} disabled={!subscription}>
                            {subscription ? (
                                <>
                                    Donwload Podcast <TbDownload size={20} className="text-neutral-400" />
                                </>
                            ) : (
                                <>
                                    Upgrade to pro to Download <TbDownloadOff size={20} className="text-neutral-400" />
                                </>
                            )}
                        </DropdownMenu.Item>
                    </DropdownMenu.Content>
                </DropdownMenu.Portal>
            </DropdownMenu.Root>
        </div>
    );
}

export default PodcastPopover;