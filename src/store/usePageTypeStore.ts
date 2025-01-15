import { create } from "zustand";

interface PageTypeStore {
  pageType: string;
  setPageType: (pageType: string) => void;
}

export const usePageTypeStore = create<PageTypeStore>()((set) => ({
  pageType: "list",
  setPageType: (pageType) =>
    set((state) => {
      return {
        ...state,
        pageType: pageType
      };
    })
}));
