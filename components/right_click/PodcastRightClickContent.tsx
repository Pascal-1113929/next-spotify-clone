import React, { useState } from "react";
import * as ContextMenu from "@radix-ui/react-context-menu";
import { HiChevronRight } from "react-icons/hi";
import { FaTrashAlt } from "react-icons/fa";
import { SlUserFollow, SlUserFollowing, SlUserUnfollow } from "react-icons/sl";
import { MdOutlineModeEditOutline } from "react-icons/md";
import { Podcast } from "@/types";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useUser } from "@/hooks/useUser";
import { TbDownload, TbDownloadOff } from "react-icons/tb";
import { useAuthModal } from "@/hooks/useAuthModal";
import { useSubscribeModal } from "@/hooks/useSubscribeModal";
import { useDeletePodcastModal } from "@/hooks/useDeletePodcastModal";
import { useEditPodcastModal } from "@/hooks/useEditPodcastModal";
import toast from "react-hot-toast";
import JSZip from "jszip";

interface PodcastRightClickContentProps {
	isOwner: boolean;
	podcast: Podcast
}

const PodcastRightClickContent: React.FC<PodcastRightClickContentProps> = ({ isOwner, podcast }) => {
	const supabaseClient = useSupabaseClient();
	const authModal = useAuthModal();
	const subscribeModal = useSubscribeModal();
	const editPodcastModal = useEditPodcastModal();
	const deletePodcastModal = useDeletePodcastModal();
	const { user, subscription } = useUser();

	const [isHovered, setIsHovered] = useState(false);

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

	const handleDeletePodcast = async () => {
		deletePodcastModal.onOpen(podcast.id);
	}

	const handleEditPodcast = async () => {
		editPodcastModal.onOpen(podcast.id);
	}

	const handleFollowPodcast = async () => {
		if (!user) {
			authModal.onOpen();
			return;
		}

		if (!podcast.isFollowed) {
			const { error } = await supabaseClient.from('podcast_follows').insert({
				podcast_id: podcast.id,
				user_id: user.id
			});

			if (error) {
				console.error('Error following podcast:', error);
				toast.error('Error following podcast');
				return;
			}

			toast.success('Podcast followed successfully');
		}

		if (podcast.isFollowed) {
			const { error: unfollowError } = await supabaseClient.from('podcast_follows')
				.delete()
				.eq('podcast_id', podcast.id)
				.eq('user_id', user.id);

			if (unfollowError) {
				console.error('Error unfollowing podcast:', unfollowError);
				toast.error('Error unfollowing podcast');
				return;
			}

			toast.success('Podcast unfollowed successfully');
		}
	}

	const FollowIcon = podcast.isFollowed ? <SlUserFollowing /> : <SlUserFollow />;
	const FollowHoverIcon = podcast.isFollowed ? <SlUserUnfollow /> : <SlUserFollow />;

	return (
		<ContextMenu.Portal>
			<ContextMenu.Content
				className="min-w-[220px] overflow-hidden rounded-md p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)] bg-neutral-950"
			>
				<ContextMenu.Item className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-green-600 
				outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green-500 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
					onClick={handleDownload}
					disabled={!subscription}
				>
					<div className="absolute left-0 inline-flex w-[25px] items-center justify-center">
						{!subscription ? (
							<TbDownloadOff />
						) : (
							<TbDownload />
						)}
					</div>
					{!subscription ? (
						<p>Upgrade to pro to Download</p>
					) : (
						<p>
							Download Podcast
						</p>
					)}
				</ContextMenu.Item>
				<ContextMenu.Item className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-green-600 
				outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green-500 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
					onClick={handleFollowPodcast}
					disabled={!user}
					onMouseEnter={() => setIsHovered(true)}
					onMouseLeave={() => setIsHovered(false)}
				>
					<div className="absolute left-0 inline-flex w-[25px] items-center justify-center">
						{isHovered ? FollowHoverIcon : FollowIcon}
					</div>
					{!user ? (
						<p>Log in to Follow</p>
					) : (
						<p>
							{podcast.isFollowed ? 'Unfollow Podcast' : 'Follow Podcast'}
						</p>
					)}
				</ContextMenu.Item>
				{isOwner && (
					<>

						<ContextMenu.Separator className="m-[5px] h-px bg-neutral-700" />

						<ContextMenu.Sub>
							<ContextMenu.SubTrigger className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-green-600 
							utline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green-500 data-[highlighted]:data-[state=open]:bg-green-500 data-[state=open]:bg-green-300 data-[disabled]:text-mauve8 
							data-[highlighted]:data-[state=open]:text-violet1 data-[highlighted]:text-violet1 data-[state=open]:text-green-600"
							>
								<div className="absolute left-0 inline-flex w-[25px] items-center justify-center">
									<MdOutlineModeEditOutline />
								</div>
								Edit podcast
								<div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
									<HiChevronRight />
								</div>
							</ContextMenu.SubTrigger>
							<ContextMenu.Portal>
								<ContextMenu.SubContent
									className="min-w-[220px] overflow-hidden rounded-md bg-neutral-800 p-[5px] shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),_0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]"
									sideOffset={2}
									alignOffset={-5}
								>
									<ContextMenu.Item className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-green-600 
									outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green-500 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
										onClick={handleEditPodcast}
									>
										<div className="absolute left-0 inline-flex w-[25px] items-center justify-center">
											<MdOutlineModeEditOutline />
										</div>
										Edit Podcast
									</ContextMenu.Item>
									{/* <ContextMenu.Separator className="m-[5px] h-px bg-neutral-700" />
									<ContextMenu.Item className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-green-600 o
									utline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green-500 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
										onClick={handleAddLyrics}
									>
										<div className="absolute left-0 inline-flex w-[25px] items-center justify-center">
											<CiTextAlignCenter />
										</div>
										Add lyrics
									</ContextMenu.Item> */}
								</ContextMenu.SubContent>
							</ContextMenu.Portal>
						</ContextMenu.Sub>

						<ContextMenu.Item
							className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-green-600 
						outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green-500 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
							onClick={handleDeletePodcast}
						>
							<div className="absolute left-0 inline-flex w-[25px] items-center justify-center">
								<FaTrashAlt />
							</div>
							Delete Podcast
						</ContextMenu.Item>
					</>
				)}

				{/* <ContextMenu.CheckboxItem
					className="group relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-green-600 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green-500 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
					checked={bookmarksChecked}
					onCheckedChange={setBookmarksChecked}
				>
					<ContextMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
						<FaCheck />
					</ContextMenu.ItemIndicator>
					Show Bookmarks{" "}
					<div className="ml-auto pl-5 text-mauve11 group-data-[disabled]:text-mauve8 group-data-[highlighted]:text-white">
						⌘+B
					</div>
				</ContextMenu.CheckboxItem>
				<ContextMenu.CheckboxItem
					className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[5px] text-[13px] leading-none text-green-600 outline-none data-[disabled]:pointer-events-none data-[highlighted]:bg-green-500 data-[disabled]:text-mauve8 data-[highlighted]:text-violet1"
					checked={urlsChecked}
					onCheckedChange={setUrlsChecked}
				>
					<ContextMenu.ItemIndicator className="absolute left-0 inline-flex w-[25px] items-center justify-center">
						<FaCheck />
					</ContextMenu.ItemIndicator>
					Show Full URLs
				</ContextMenu.CheckboxItem> */}
			</ContextMenu.Content>
		</ContextMenu.Portal>
	);
};

export default PodcastRightClickContent;