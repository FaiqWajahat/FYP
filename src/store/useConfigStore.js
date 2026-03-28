import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useConfigStore = create(
  persist(
    (set) => ({
      projectName: 'Factory Flow',
      isDarkMode: false,
      setProjectName: (name) => set({ projectName: name }),
      toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
    }),
    {
      name: 'config-storage',
    }
  )
);
