import { useStore } from "@/store/store";

// hooks
export const useTriggers = () => {
  return useStore((state) => state.triggers);
};

// actions
export const toggleTrigger = (triggerIndex: number) => {
  const state = useStore.getState();

  const triggerToToggle = state.triggers[triggerIndex];
  if (!triggerToToggle) throw new Error("Trigger not found");

  const newTriggers = state.triggers.map((trigger, index) => {
    if (index === triggerIndex) {
      return { ...trigger, active: !trigger.active };
    }
    return trigger;
  });

  useStore.setState({ triggers: newTriggers });
};

export const setTriggerText = (triggerIndex: number, text: string) => {
  const state = useStore.getState();

  const triggerToSetText = state.triggers[triggerIndex];
  if (!triggerToSetText) throw new Error("Trigger not found");

  const newTriggers = state.triggers.map((trigger, index) => {
    if (index === triggerIndex) {
      return { ...trigger, name: text };
    }
    return trigger;
  });

  useStore.setState({ triggers: newTriggers });
};

export const deleteTrigger = (triggerIndex: number) => {
  const state = useStore.getState();

  const triggerToDelete = state.triggers[triggerIndex];
  if (!triggerToDelete) throw new Error("Trigger not found");

  const newTriggers = state.triggers.filter((_, index) => index !== triggerIndex);

  useStore.setState({ triggers: newTriggers });
};

export const addTrigger = (text: string) => {
  const state = useStore.getState();

  const addedTrigger = { name: text, active: false };
  const newTriggers = [...state.triggers, addedTrigger];

  useStore.setState({ triggers: newTriggers });
};

export const moveTrigger = (fromIndex: number, direction: "up" | "down") => {
  const state = useStore.getState();

  if (fromIndex === 0 && direction === "up") return;
  if (fromIndex === state.triggers.length - 1 && direction === "down") return;

  const triggerToMove = state.triggers[fromIndex];
  if (!triggerToMove) throw new Error("Trigger not found");

  const newTriggers = [...state.triggers];

  if (direction === "up") {
    const temp = newTriggers[fromIndex - 1];
    newTriggers[fromIndex - 1] = newTriggers[fromIndex];
    newTriggers[fromIndex] = temp;
  } else {
    const temp = newTriggers[fromIndex + 1];
    newTriggers[fromIndex + 1] = newTriggers[fromIndex];
    newTriggers[fromIndex] = temp;
  }

  useStore.setState({ triggers: newTriggers });
};
