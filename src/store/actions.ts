import { StoreState, useStore } from "@/store/store";
import { useShallow } from "zustand/shallow";

// hooks
export const useCurrentAndNextActions = () => {
  return useStore(
    useShallow((state) => {
      const currentAction = getCurrentAction(state);
      if (!currentAction) return { currentAction: undefined, nextAction: undefined };

      const nextAction = getCurrentAction({
        ...state,
        actions: state.actions.filter(
          (action) =>
            action.condition !== currentAction.condition || action.action !== currentAction.action
        ),
      });

      return { currentAction, nextAction };
    })
  );
};

export const useActions = () => {
  return useStore((state) => state.actions);
};

export const useConditions = () => {
  return useStore(
    useShallow((state) => {
      return state.triggers.concat(state.states).map((condition) => condition.name);
    })
  );
};

// actions
export const passAction = () => {
  const state = useStore.getState();

  const actionToPass = getCurrentAction(state);
  if (!actionToPass) throw new Error("No action to pass");

  const newActions = state.actions.map((action) => {
    if (action === actionToPass) {
      return { ...action, passed: true };
    }
    return action;
  });

  useStore.setState({ actions: newActions });
};

export const setActionCondition = (actionIndex: number, condition: string | undefined) => {
  const state = useStore.getState();

  const actionToSetCondition = state.actions[actionIndex];
  if (!actionToSetCondition) throw new Error("Action not found");

  const newActions = state.actions.map((action, index) => {
    if (index === actionIndex) {
      return { ...action, condition };
    }
    return action;
  });

  useStore.setState({ actions: newActions });
};

export const setActionText = (actionIndex: number, text: string) => {
  const state = useStore.getState();

  const actionToSetText = state.actions[actionIndex];
  if (!actionToSetText) throw new Error("Action not found");

  const newActions = state.actions.map((action, index) => {
    if (index === actionIndex) {
      return { ...action, action: text };
    }
    return action;
  });

  useStore.setState({ actions: newActions });
};

export const deleteAction = (actionIndex: number) => {
  const state = useStore.getState();

  const actionToDelete = state.actions[actionIndex];
  if (!actionToDelete) throw new Error("Action not found");

  const newActions = state.actions.filter((_, index) => index !== actionIndex);

  useStore.setState({ actions: newActions });
};

export const addAction = (text: string) => {
  const state = useStore.getState();

  const addedAction = { action: text, passed: false };
  const newActions = [...state.actions, addedAction];

  useStore.setState({ actions: newActions });
};

export const moveAction = (fromIndex: number, direction: "up" | "down") => {
  const state = useStore.getState();

  if (fromIndex === 0 && direction === "up") return;
  if (fromIndex === state.actions.length - 1 && direction === "down") return;

  const actionToMove = state.actions[fromIndex];
  if (!actionToMove) throw new Error("Action not found");

  const newActions = [...state.actions];

  if (direction === "up") {
    const temp = newActions[fromIndex - 1];
    newActions[fromIndex - 1] = newActions[fromIndex];
    newActions[fromIndex] = temp;
  } else {
    const temp = newActions[fromIndex + 1];
    newActions[fromIndex + 1] = newActions[fromIndex];
    newActions[fromIndex] = temp;
  }

  useStore.setState({ actions: newActions });
};

// utils
const getCurrentAction = (state: StoreState) => {
  const activeConditionNames = state.triggers
    .concat(state.states)
    .filter((condition) => condition.active)
    .map((condition) => condition.name);

  const currentAction = state.actions.find((action) => {
    const actionAction = action.condition ? activeConditionNames.includes(action.condition) : true;
    return actionAction && !action.passed;
  });

  return currentAction;
};
