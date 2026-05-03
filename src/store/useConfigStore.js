import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConfigStore = create(
  persist(
    (set) => ({
      projectName: 'Factory Flow',
      isDarkMode: false,
      isChatOpen: false,
      chatContext: null,
      setProjectName: (name) => set({ projectName: name }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
      setIsChatOpen: (open) => set({ isChatOpen: open }),
      setChatContext: (context) => set({ chatContext: context }),
    }),
    {
      name: 'config-storage',
    }
  )
);
