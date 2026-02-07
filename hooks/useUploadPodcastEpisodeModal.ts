import { create } from "zustand";

interface UploadPodcastEpisodeModalStore {
    isOpen: boolean;
    PodcastId: string | null;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useUploadPodcastEpisodeModal = create<UploadPodcastEpisodeModalStore>((set) => ({
    isOpen: false,
    PodcastId: null,
    onOpen: (id: string) => set({ isOpen: true, PodcastId: id }),
    onClose: () => set({ isOpen: false, PodcastId: null }),
}))