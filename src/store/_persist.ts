import { MMKV } from "react-native-mmkv";
import { createJSONStorage } from "zustand/middleware";

const storage = new MMKV();

export const mmkvStorage = {
  getItem: (name: string) => storage.getString(name) ?? null,
  setItem: (name: string, value: string) => storage.set(name, value),
  removeItem: (name: string) => storage.delete(name),
};

export const jsonMMKV = () => createJSONStorage(() => mmkvStorage);
