import {
  addState,
  deleteState,
  moveState,
  resetStates,
  setStateText,
  toggleState,
  useStates,
} from "@/store/states";
import {
  IconButton,
  List,
  ListItem,
  ListItemText,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  Delete,
  Done,
  East,
  Edit,
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
  Refresh,
} from "@mui/icons-material";
import { useState } from "react";
import { motion } from "motion/react";

interface Props {
  next: () => void;
}

export const States = ({ next }: Props) => {
  const [editing, setEditing] = useState(false);

  const states = useStates();

  return (
    <div className="size-full flex flex-col">
      {/* body */}
      <div className="flex flex-col grow w-full items-center justify-center">
        <Typography variant="h1" className="!text-3xl !font-normal !mb-2">
          What Am
        </Typography>

        <List>
          {!editing &&
            states.map((state, index) => (
              <ListItem key={index} className="h-14" onClick={() => toggleState(index)}>
                <ListItemText primary={state.name} />
                <Switch checked={state.active} />
              </ListItem>
            ))}
          {editing && (
            <>
              {states.map((state, index) => (
                // will break if name isn't unique, but it should be
                <ListItem key={state.name} component={motion.li} layout>
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

        {!editing && (
          <IconButton color="primary" title="Next" onClick={() => next()}>
            <East />
          </IconButton>
        )}
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
