import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToolId = 
  | 'notes' 
  | 'formatter' 
  | 'json' 
  | 'http' 
  | 'security' 
  | 'git' 
  | 'env' 
  | 'logs' 
  | 'utils'
  | 'frontend'
  | 'system'
  | 'time';

export interface Tab {
  id: string;
  toolId: ToolId;
  title: string;
  active: boolean;
  data?: any;
}

interface AppState {
  tabs: Tab[];
  activeTabId: string | null;
  sidebarOpen: boolean;
  
  // Actions
  addTab: (toolId: ToolId, title: string, data?: any) => void;
  removeTab: (id: string) => void;
  closeAllTabs: () => void;
  setActiveTab: (id: string) => void;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      tabs: [],
      activeTabId: null,
      sidebarOpen: true,

      addTab: (toolId, title, data) => set((state) => {
        const id = Math.random().toString(36).substring(7);
        const newTab = { id, toolId, title, active: true, data };
        return {
          tabs: [...state.tabs.map(t => ({ ...t, active: false })), newTab],
          activeTabId: id
        };
      }),

      removeTab: (id) => set((state) => {
        const newTabs = state.tabs.filter(t => t.id !== id);
        let newActiveId = state.activeTabId;
        if (state.activeTabId === id) {
          newActiveId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
        }
        return {
          tabs: newTabs.map(t => ({ ...t, active: t.id === newActiveId })),
          activeTabId: newActiveId
        };
      }),

      closeAllTabs: () => set({ tabs: [], activeTabId: null }),

      setActiveTab: (id) => set((state) => ({
        tabs: state.tabs.map(t => ({ ...t, active: t.id === id })),
        activeTabId: id
      })),

      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: 'devstation-storage',
      partialize: (state) => ({ sidebarOpen: state.sidebarOpen }),
    }
  )
);
