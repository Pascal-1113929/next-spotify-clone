"use client";

import { useEffect, useState } from "react";

import AuthModal from "@/components/modals/AuthModal";
import UploadModal from "@/components/modals/UploadModal";
import SubscribeModal from "@/components/modals/SubscribeModal";
import { ProductWithPrice } from "@/types";
import CreatePlaylistModal from "@/components/modals/CreatePlaylistModal";
import AddToPlaylistModal from "@/components/modals/AddToPlaylistModal";
import DeletePlaylistModal from "@/components/modals/DeletePlaylistModal";
import DeleteSongModal from "@/components/modals/DeleteSongModal";
import SongEditModal from "@/components/modals/EditSongModal";
import AddLyricsModal from "@/components/modals/AddLyricsModal";
import PlaylistEditModal from "@/components/modals/EditPlaylistModal";
import BatchAddToPlaylistModal from "@/components/modals/BatchAddToPlaylistModal";
import ClonePlaylistModal from "@/components/modals/ClonePlaylistModal";
import CreateAlbumModal from "@/components/modals/CreateAlbumModal";
import UploadAlbumModal from "@/components/modals/UploadAlbumModal";
import DeleteAlbumModal from "@/components/modals/DeleteAlbumModal";
import AlbumEditModal from "@/components/modals/EditAlbumModal";
import CreatePodcastModal from "@/components/modals/CreatePodcastModal";
import CreatePodcastTagModal from "@/components/modals/CreatePodcastTagModal";
import DeletePodcastModal from "@/components/modals/DeletePodcastModal";
import EditPodcastModal from "@/components/modals/EditPodcastModal";
import UploadPodcastEpisodeModal from "@/components/modals/UploadPodcastEpisodeModal";

interface ModalProviderProps {
    products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModalProviderProps> = ({
    products
}) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <>
            <AuthModal />
            <UploadModal />
            <SubscribeModal products={products} />
            <UploadAlbumModal />
            <CreatePlaylistModal />
            <AddToPlaylistModal />
            <DeletePlaylistModal />
            <DeleteSongModal />
            <DeleteAlbumModal />
            <SongEditModal />
            <AddLyricsModal />
            <PlaylistEditModal />
            <BatchAddToPlaylistModal />
            <ClonePlaylistModal />
            <CreateAlbumModal />
            <AlbumEditModal />
            <CreatePodcastTagModal />
            <CreatePodcastModal />
            <DeletePodcastModal />
            <EditPodcastModal />
            <UploadPodcastEpisodeModal />
        </>
    );
}

export default ModalProvider;