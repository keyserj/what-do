import {
  addState,
  deleteState,
  moveState,
  resetStates,
  setStateText,
  toggleState,
  useStates,
} from "@/store";
import { IconButton, List, ListItem, ListItemText, Switch, TextField } from "@mui/material";
import {
  Delete,
  Done,
  Edit,
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
  Refresh,
} from "@mui/icons-material";
import { useState } from "react";

export const States = () => {
  const [editing, setEditing] = useState(false);

  const states = useStates();

  return (
    <div className="size-full flex flex-col">
      {/* body */}
      <div className="flex grow w-full items-center justify-center">
        <List>
          {!editing &&
            states.map((state, index) => (
              <ListItem key={index} onClick={() => toggleState(index)}>
                <ListItemText primary={state.name} />
                <Switch checked={state.active} className="pointer-events-none" />
              </ListItem>
            ))}
          {editing && (
            <>
              {states.map((state, index) => (
                <ListItem key={index}>
                  <IconButton
                    color="primary"
                    title="Move up"
                    onClick={() => moveState(index, "up")}
                  >
                    <KeyboardDoubleArrowUp />
                  </IconButton>
                  <IconButton
                    color="primary"
                    title="Move down"
                    onClick={() => moveState(index, "down")}
                  >
                    <KeyboardDoubleArrowDown />
                  </IconButton>
                  <TextField
                    size="small"
                    value={state.name}
                    onChange={(event) => setStateText(index, event.target.value)}
                  />
                  <IconButton color="primary" title="Delete" onClick={() => deleteState(index)}>
                    <Delete />
                  </IconButton>
                </ListItem>
              ))}
              <ListItem>
                <IconButton className="invisible">
                  <Delete />
                </IconButton>
                <IconButton className="invisible">
                  <Delete />
                </IconButton>
                <TextField
                  size="small"
                  placeholder="Add a new state"
                  onBlur={(event) => {
                    if (!event.target.value) return;
                    addState(event.target.value);
                    event.target.value = "";
                  }}
                />
              </ListItem>
            </>
          )}
        </List>
      </div>

      {/* footer */}
      <div className="w-full flex justify-center h-12">
        <IconButton color="primary" title="Reset states" onClick={() => resetStates()}>
          <Refresh />
        </IconButton>
        {!editing && (
          <IconButton color="primary" title="Edit states" onClick={() => setEditing(!editing)}>
            <Edit />
          </IconButton>
        )}
        {editing && (
          <IconButton color="primary" title="Done" onClick={() => setEditing(!editing)}>
            <Done />
          </IconButton>
        )}
      </div>
    </div>
  );
};
