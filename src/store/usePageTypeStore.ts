import { create } from "zustand";

type PageType = "list" | "board";

interface PageTypeStore {
  pageType: PageType;
  setPageType: (pageType: PageType) => void;
}

export const usePageTypeStore = create<PageTypeStore>((set) => ({
  pageType: "list", 
  setPageType: (pageType) => set({ pageType }),
}));
