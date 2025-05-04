import JSONCrush from "jsoncrush";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Condition {
  name: string;
  active: boolean;
}

export interface StoreState {
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
  actions: [
    { condition: "lack of sleep", action: "Take a nap.", passed: false },
    { action: "Go to bed.", passed: false },
  ],
  motivations: [{ text: "Sleep is important for your health.", passed: false }],
};

const persistName = "what-do-storage";

export const useStore = create<StoreState>()(
  persist(() => initialState, {
    name: persistName,
    skipHydration: true, // manually hydrate so we can show a loading state
    partialize: (state) => ({
      // exclude trigger active because user should be re-setting these each time they open the app
      triggers: state.triggers.map((trigger) => ({ ...trigger, active: false })),
      states: state.states,
      // exclude action passed because user should re-see these each time they open the app
      actions: state.actions.map((action) => ({ ...action, passed: false })),
      // exclude motivation passed because user should re-see these each time they open the app
      motivations: state.motivations.map((motivation) => ({ ...motivation, passed: false })),
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

export const loadFromUrl = async (encodedState: string) => {
  if (encodedState) {
    const decoded = decodeURIComponent(encodedState);
    const uncrushed = JSONCrush.uncrush(decoded);
    useStore.setState(JSON.parse(uncrushed));
  } else {
    useStore.setState(initialState);
  }
};

export const buildUrlFromState = async () => {
  const state = useStore.getState();

  // seems like JSONCrush is pretty good for compression... gzip is close? but logic for that is annoying
  const crushed = JSONCrush.crush(JSON.stringify(state));

  const uriEncoded = encodeURIComponent(crushed);

  const url = new URL(window.location.href);
  url.searchParams.set("settings", uriEncoded);

  return url.toString();
};
