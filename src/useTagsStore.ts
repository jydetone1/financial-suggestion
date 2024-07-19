import { create } from 'zustand';

interface TagsStore {
  tags: string[];
  addTag: (tag: string) => void;
  updateTag: (index: number, newTag: string) => void;
  deleteTag: (index: number) => void;
  text: string;
  editText: string;
  setText: (text: string) => void;
  setEditText: (editText: string) => void;
  display: boolean;
  setDisplay: (display: boolean) => void;
  onClickEdit: (index: number | null) => void;
  editingIndex: number | null;
}

export const useTagsStore = create<TagsStore>((set, get) => ({
  tags: [],
  addTag: (tag) => set((state) => ({ tags: [...state.tags, tag] })),
  updateTag: (index, newTag) =>
    set((state) => {
      const updatedTags = [...state.tags];
      updatedTags[index] = newTag;
      return { tags: updatedTags };
    }),
  deleteTag: (index) => {
    set((state) => ({ tags: state.tags.filter((_, i) => i !== index) }));
    set({ editingIndex: null });
  },
  text: '',
  editText: '',
  setText: (text) => set({ text }),
  setEditText: (editText) => set({ editText }),
  display: false,
  setDisplay: (display) => set({ display }),
  editingIndex: null,
  onClickEdit: (index) => {
    const { tags } = get();
    if (index !== null) {
      const tag = tags[index];
      set({ editText: tag });
    }
    set({ editingIndex: index });
  },
}));
