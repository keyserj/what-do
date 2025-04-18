import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Condition {
  name: string;
  active: boolean;
}

interface StoreState {
  triggers: Condition[];
  states: Condition[];
  actions: {
    /**
     * string of trigger or state - when condition is active, show this action
     */
    condition?: string;
    action: string;
    passed: boolean;
  }[];
  motivations: { text: string; passed: boolean }[];
}

const initialState: StoreState = {
  triggers: [{ name: "procrastinating", active: false }],
  states: [{ name: "lack of sleep", active: false }],
  actions: [{ condition: "lack of sleep", action: "Take a nap.", passed: false }],
  motivations: [{ text: "Sleep is important for your health.", passed: false }],
};

const persistName = "what-do-storage";

export const useStore = create<StoreState>()(
  persist(() => initialState, {
    name: persistName,
    skipHydration: true, // manually hydrate so we can show a loading state
    partialize: (state) => ({
      // exclude trigger active because user should be re-setting these each time they open the app
      triggers: state.triggers.map((trigger) => ({ name: trigger.name, active: false })),
      states: state.states,
      actions: state.actions,
      motivations: state.motivations,
    }),
  })
);

// utils
export const loadFromStorage = async () => {
  if (useStore.persist.getOptions().storage?.getItem(persistName)) {
    await useStore.persist.rehydrate();
  } else {
    useStore.setState(initialState);
  }
};
