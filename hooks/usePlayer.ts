import { create } from "zustand";

interface PlayerStore {
    ids: string[];
    activateId?: string;
    type: "song" | "podcast";
    shuffle: boolean;
    setId: (id: string, type: "song" | "podcast") => void;
    setIds: (ids: string[]) => void;
    toggleShuffle: () => void;
    reset: () => void;
}

const usePlayer = create<PlayerStore>((set) => ({
    ids: [],
    activateId: undefined,
    type: "song",
    shuffle: false,
    setId: (id: string, type: "song" | "podcast") => set({ activateId: id, type }),
    setIds: (ids: string[]) => set({ ids }),
    toggleShuffle: () => set((state) => ({ shuffle: !state.shuffle })),
    reset: () => set({activateId: undefined, type: "song"}),
}));

export default usePlayer;