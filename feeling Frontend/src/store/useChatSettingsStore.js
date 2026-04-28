import { create } from "zustand";

export const useChatSettingsStore = create((set, get) => ({
  isSoundEnabled: localStorage.getItem("isSoundEnabled") === "true",

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;

    localStorage.setItem("isSoundEnabled", newValue);
    set({ isSoundEnabled: newValue });
  },
}));