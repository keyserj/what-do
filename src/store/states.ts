import { useStore } from "@/store/store";

// hooks
export const useStates = () => {
  return useStore((state) => state.states);
};

// actions
export const toggleState = (stateIndex: number) => {
  const state = useStore.getState();

  const stateToToggle = state.states[stateIndex];
  if (!stateToToggle) throw new Error("State not found");

  const newStates = state.states.map((state, index) => {
    if (index === stateIndex) {
      return { ...state, active: !state.active };
    }
    return state;
  });

  useStore.setState({ states: newStates });
};

export const setStateText = (stateIndex: number, text: string) => {
  const state = useStore.getState();

  const stateToSetText = state.states[stateIndex];
  if (!stateToSetText) throw new Error("State not found");

  const newStates = state.states.map((state, index) => {
    if (index === stateIndex) {
      return { ...state, name: text };
    }
    return state;
  });

  useStore.setState({ states: newStates });
};

export const deleteState = (stateIndex: number) => {
  const state = useStore.getState();

  const stateToDelete = state.states[stateIndex];
  if (!stateToDelete) throw new Error("State not found");

  const newStates = state.states.filter((_, index) => index !== stateIndex);

  useStore.setState({ states: newStates });
};

export const addState = (text: string) => {
  const state = useStore.getState();

  const addedState = { name: text, active: false };
  const newStates = [...state.states, addedState];

  useStore.setState({ states: newStates });
};

export const moveState = (fromIndex: number, direction: "up" | "down") => {
  const state = useStore.getState();

  if (fromIndex === 0 && direction === "up") return;
  if (fromIndex === state.states.length - 1 && direction === "down") return;

  const stateToMove = state.states[fromIndex];
  if (!stateToMove) throw new Error("State not found");

  const newStates = [...state.states];

  if (direction === "up") {
    const temp = newStates[fromIndex - 1];
    newStates[fromIndex - 1] = newStates[fromIndex];
    newStates[fromIndex] = temp;
  } else {
    const temp = newStates[fromIndex + 1];
    newStates[fromIndex + 1] = newStates[fromIndex];
    newStates[fromIndex] = temp;
  }

  useStore.setState({ states: newStates });
};

export const resetStates = () => {
  const state = useStore.getState();

  const newStates = state.states.map((state) => {
    return { ...state, active: false };
  });

  useStore.setState({ states: newStates });
};
