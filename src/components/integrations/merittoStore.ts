"use client";

import { useSyncExternalStore } from "react";

type MerittoSlot = "inline" | "drawer";

let activeSlot: MerittoSlot = "inline";
let isDrawerOpen = false;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((listener) => listener());
}

export const merittoStore = {
  getSlot: () => activeSlot,
  isOpen: () => isDrawerOpen,
  openDrawer: () => {
    isDrawerOpen = true;
    activeSlot = "drawer";
    notify();
  },
  closeDrawer: () => {
    isDrawerOpen = false;
    activeSlot = "inline";
    notify();
  },
  subscribe: (listener: () => void) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useMerittoStore() {
  const isDrawerOpen = useSyncExternalStore(
    merittoStore.subscribe,
    merittoStore.isOpen,
    () => false
  );
  const activeSlot = useSyncExternalStore(
    merittoStore.subscribe,
    merittoStore.getSlot,
    () => "inline"
  );

  return {
    isDrawerOpen,
    activeSlot,
    openDrawer: merittoStore.openDrawer,
    closeDrawer: merittoStore.closeDrawer,
  };
}

