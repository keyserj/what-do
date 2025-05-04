import { Dialog, IconButton, Link, List, ListItem, TextField, Typography } from "@mui/material";
import {
  Delete,
  Done,
  Edit,
  KeyboardDoubleArrowDown,
  KeyboardDoubleArrowUp,
} from "@mui/icons-material";
import { useState } from "react";
import { motion } from "motion/react";
import {
  addAction,
  deleteAction,
  moveAction,
  passAction,
  setActionCondition,
  setActionText,
  useActions,
  useConditions,
  useCurrentAndNextActions,
} from "@/store/actions";
import { throwError } from "@/common/errorHandling";

const CurrentAction = ({ next }: Props) => {
  const { currentAction, nextAction } = useCurrentAndNextActions();

  if (!currentAction) return "No actions left to show, try adding some.";

  return (
    <>
      {currentAction.condition && (
        <Typography variant="caption" color="primary">
          (Reason: {currentAction.condition})
        </Typography>
      )}

      <Typography variant="h5" className="!my-6">
        {currentAction.action}
      </Typography>

      <div className="flex gap-3">
        <Link component="button" className="text-sm" onClick={() => next()}>
          I think I will
        </Link>
        <Link
          component="button"
          className="text-sm"
          onClick={() => {
            if (nextAction) passAction();
            else next(); // we've gone through all our applicable actions
          }}
        >
          Not now
        </Link>
      </div>
    </>
  );
};

const EditingActions = () => {
  const actions = useActions();
  const conditions = useConditions();

  const [editingActionIndex, setEditingActionIndex] = useState<number | undefined>(undefined);
  const editingAction =
    editingActionIndex !== undefined
      ? actions[editingActionIndex] ??
        throwError("couldn't find action", actions, editingActionIndex)
      : undefined;

  return (
    <>
      <Typography variant="h1" className="!text-3xl !font-normal !mb-2">
        What Do
      </Typography>
      <List className="w-full">
        {actions.map((action, index) => (
          <ListItem
            // Will break if name isn't unique, but it should be.
            // Include `condition` in case we want the same text should appear for two conditions (could use a multi-select for that but nah).
            key={action.condition + action.action}
            component={motion.li}
            layout
            className="w-full"
          >
            <IconButton color="primary" title="Move up" onClick={() => moveAction(index, "up")}>
              <KeyboardDoubleArrowUp />
            </IconButton>
            <IconButton color="primary" title="Move down" onClick={() => moveAction(index, "down")}>
              <KeyboardDoubleArrowDown />
            </IconButton>
            <TextField
              size="small"
              // no label because if condition is set to empty via editing modal, this Mui label doesn't re-render to go back into the text field
              value={action.condition}
              onChange={(event) => setActionCondition(index, event.target.value)}
              select
              slotProps={{ select: { native: true } }}
              className="!mr-2 w-32 shrink-0"
            >
              <option value={undefined} />
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </TextField>
            <Link
              component="button"
              className="text-sm grow whitespace-nowrap overflow-hidden text-ellipsis text-left"
              onClick={() => setEditingActionIndex(index)}
            >
              {action.action}
            </Link>
            <IconButton color="primary" title="Delete" onClick={() => deleteAction(index)}>
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
            placeholder="Add a new action"
            onBlur={(event) => {
              if (!event.target.value) return;
              addAction(event.target.value);
              event.target.value = "";
            }}
            className="grow"
          />
          <IconButton className="invisible">
            <Delete />
          </IconButton>
        </ListItem>
      </List>

      {editingActionIndex !== undefined && editingAction !== undefined && (
        <Dialog open={true} onClose={() => setEditingActionIndex(undefined)}>
          <div className="flex flex-col m-6 gap-2">
            <TextField
              label="Condition"
              size="small"
              value={editingAction.condition}
              onChange={(event) => setActionCondition(editingActionIndex, event.target.value)}
              select
              slotProps={{ select: { native: true } }}
            >
              <option value={undefined} />
              {conditions.map((condition) => (
                <option key={condition} value={condition}>
                  {condition}
                </option>
              ))}
            </TextField>
            <TextField
              label="Action"
              size="small"
              multiline
              defaultValue={editingAction.action}
              onBlur={(event) => setActionText(editingActionIndex, event.target.value)}
            />
          </div>
        </Dialog>
      )}
    </>
  );
};

interface Props {
  next: () => void;
}

export const Actions = ({ next }: Props) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="size-full flex flex-col text-center">
      {/* body */}
      <div className="flex flex-col grow w-full items-center justify-center">
        {!editing && <CurrentAction next={next} />}
        {editing && <EditingActions />}
      </div>

      {/* footer */}
      <div className="w-full flex justify-center h-12">
        {!editing && (
          <IconButton color="primary" title="Edit actions" onClick={() => setEditing(!editing)}>
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
