import { create } from 'zustand';

interface TagsStore {
  tags: string[];
  addTag: (tag: string) => void;
  deleteTag: (index: number) => void;
  text: string;
  setText: (text: string) => void;
  display: boolean;
  setDisplay: (display: boolean) => void;
}

export const useTagsStore = create<TagsStore>((set) => ({
  tags: [],
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  deleteTag: (index) =>
    set((state) => ({ tags: state.tags.filter((_, i) => i !== index) })),
  text: '',
  setText: (text) => set({ text }),
  display: false,
  setDisplay: (display) => set({ display }),
}));
