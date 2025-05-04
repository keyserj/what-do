import {
  Checkbox,
  IconButton,
  List,
  ListItem,
  ListItemText,
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
} from "@mui/icons-material";
import { useState } from "react";
import { motion } from "motion/react";
import {
  addTrigger,
  deleteTrigger,
  moveTrigger,
  setTriggerText,
  toggleTrigger,
  useTriggers,
} from "@/store/triggers";

interface Props {
  next: () => void;
}

export const Triggers = ({ next }: Props) => {
  const [editing, setEditing] = useState(false);

  const triggers = useTriggers();

  return (
    <div className="size-full flex flex-col">
      {/* body */}
      <div className="flex flex-col grow w-full items-center justify-center">
        <Typography variant="h1" className="!text-3xl !font-normal !mb-2">
          Why Did
        </Typography>

        <List>
          {!editing &&
            triggers.map((trigger, index) => (
              <ListItem key={index} className="h-14" onClick={() => toggleTrigger(index)}>
                <ListItemText primary={trigger.name} />
                <Checkbox checked={trigger.active} />
              </ListItem>
            ))}
          {editing && (
            <>
              {triggers.map((trigger, index) => (
                // will break if name isn't unique, but it should be
                <ListItem key={trigger.name} component={motion.li} layout>
                  <IconButton
                    color="primary"
                    title="Move up"
                    onClick={() => moveTrigger(index, "up")}
                  >
                    <KeyboardDoubleArrowUp />
                  </IconButton>
                  <IconButton
                    color="primary"
                    title="Move down"
                    onClick={() => moveTrigger(index, "down")}
                  >
                    <KeyboardDoubleArrowDown />
                  </IconButton>
                  <TextField
                    size="small"
                    value={trigger.name}
                    onChange={(event) => setTriggerText(index, event.target.value)}
                  />
                  <IconButton color="primary" title="Delete" onClick={() => deleteTrigger(index)}>
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
                  placeholder="Add a new trigger"
                  onBlur={(event) => {
                    if (!event.target.value) return;
                    addTrigger(event.target.value);
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
        {!editing && (
          <IconButton color="primary" title="Edit triggers" onClick={() => setEditing(!editing)}>
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
