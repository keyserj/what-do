import { StoreState, useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";

// hooks
export const useCurrentAndNextMotivations = () => {
  return useStore(
    useShallow((state) => {
      const currentMotivation = getCurrentMotivation(state);
      if (!currentMotivation) return { currentMotivation: undefined, nextMotivation: undefined };

      const nextMotivation = getCurrentMotivation({
        ...state,
        motivations: state.motivations.filter(
          (motivation) => motivation.text !== currentMotivation.text
        ),
      });

      return { currentMotivation, nextMotivation };
    })
  );
};

export const useMotivations = () => {
  return useStore((state) => state.motivations);
};

// actions
export const passMotivation = () => {
  const state = useStore.getState();

  const motivationToPass = getCurrentMotivation(state);
  if (!motivationToPass) throw new Error("No motivation to pass");

  const newMotivations = state.motivations.map((motivation) => {
    if (motivation === motivationToPass) {
      return { ...motivation, passed: true };
    }
    return motivation;
  });

  useStore.setState({ motivations: newMotivations });
};

export const setMotivationText = (motivationIndex: number, text: string) => {
  const state = useStore.getState();

  const motivationToSetText = state.motivations[motivationIndex];
  if (!motivationToSetText) throw new Error("Motivation not found");

  const newMotivations = state.motivations.map((motivation, index) => {
    if (index === motivationIndex) {
      return { ...motivation, motivation: text };
    }
    return motivation;
  });

  useStore.setState({ motivations: newMotivations });
};

export const deleteMotivation = (motivationIndex: number) => {
  const state = useStore.getState();

  const motivationToDelete = state.motivations[motivationIndex];
  if (!motivationToDelete) throw new Error("Motivation not found");

  const newMotivations = state.motivations.filter((_, index) => index !== motivationIndex);

  useStore.setState({ motivations: newMotivations });
};

export const addMotivation = (text: string) => {
  const state = useStore.getState();

  const addedMotivation = { text, passed: false };
  const newMotivations = [...state.motivations, addedMotivation];

  useStore.setState({ motivations: newMotivations });
};

export const moveMotivation = (fromIndex: number, direction: "up" | "down") => {
  const state = useStore.getState();

  if (fromIndex === 0 && direction === "up") return;
  if (fromIndex === state.motivations.length - 1 && direction === "down") return;

  const motivationToMove = state.motivations[fromIndex];
  if (!motivationToMove) throw new Error("Motivation not found");

  const newMotivations = [...state.motivations];

  if (direction === "up") {
    const temp = newMotivations[fromIndex - 1];
    newMotivations[fromIndex - 1] = newMotivations[fromIndex];
    newMotivations[fromIndex] = temp;
  } else {
    const temp = newMotivations[fromIndex + 1];
    newMotivations[fromIndex + 1] = newMotivations[fromIndex];
    newMotivations[fromIndex] = temp;
  }

  useStore.setState({ motivations: newMotivations });
};

// utils
const getCurrentMotivation = (state: StoreState) => {
  const currentMotivation = state.motivations.find((motivation) => !motivation.passed);
  return currentMotivation;
};
