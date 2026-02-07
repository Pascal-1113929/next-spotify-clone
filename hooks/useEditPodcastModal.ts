import { create } from "zustand";

interface EditPodcastModalStore {
    isOpen: boolean;
    podcastId: string | null;
    onOpen: (id: string) => void;
    onClose: () => void;
}

export const useEditPodcastModal = create<EditPodcastModalStore>((set) => ({
    isOpen: false,
    podcastId: null,
    onOpen: (id: string) => set({ isOpen: true, podcastId: id }),
    onClose: () => set({ isOpen: false, podcastId: null }),
}))