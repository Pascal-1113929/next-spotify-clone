import { create } from "zustand";

interface DeletePodcastModalStore {
    isOpen: boolean;
    podcastId: string | null;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useDeletePodcastModal = create<DeletePodcastModalStore>((set) => ({
    isOpen: false,
    podcastId: null,
    onOpen: (id: string) => set({ isOpen: true, podcastId: id }),
    onClose: () => set({ isOpen: false, podcastId: null }),
}));