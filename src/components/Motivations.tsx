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
  addMotivation,
  deleteMotivation,
  moveMotivation,
  passMotivation,
  setMotivationText,
  useMotivations,
  useCurrentAndNextMotivations,
} from "@/store/motivations";
import { throwError } from "@/common/errorHandling";

const CurrentMotivation = ({ next }: Props) => {
  const { currentMotivation, nextMotivation } = useCurrentAndNextMotivations();

  if (!currentMotivation) return "No motivations left to show, try adding some.";

  return (
    <>
      <Typography variant="h5" className="!my-6">
        {currentMotivation.text}
      </Typography>

      <div className="flex gap-3">
        <Link component="button" className="text-sm" onClick={() => next()}>
          I can do this
        </Link>
        <Link
          component="button"
          className="text-sm"
          onClick={() => {
            if (nextMotivation) passMotivation();
            else next(); // we've gone through all our applicable motivations
          }}
        >
          What else
        </Link>
      </div>
    </>
  );
};

const EditingMotivations = () => {
  const motivations = useMotivations();

  const [editingMotivationIndex, setEditingMotivationIndex] = useState<number | undefined>(
    undefined
  );
  const editingMotivation =
    editingMotivationIndex !== undefined
      ? motivations[editingMotivationIndex] ??
        throwError("couldn't find motivation", motivations, editingMotivationIndex)
      : undefined;

  return (
    <>
      <Typography variant="h1" className="!text-3xl !font-normal !mb-2">
        Why Do
      </Typography>
      <List className="w-full">
        {motivations.map((motivation, index) => (
          <ListItem
            // will break if text isn't unique, but it should be
            key={motivation.text}
            component={motion.li}
            layout
            className="w-full"
          >
            <IconButton color="primary" title="Move up" onClick={() => moveMotivation(index, "up")}>
              <KeyboardDoubleArrowUp />
            </IconButton>
            <IconButton
              color="primary"
              title="Move down"
              onClick={() => moveMotivation(index, "down")}
            >
              <KeyboardDoubleArrowDown />
            </IconButton>
            <Link
              component="button"
              className="text-sm grow whitespace-nowrap overflow-hidden text-ellipsis text-left"
              onClick={() => setEditingMotivationIndex(index)}
            >
              {motivation.text}
            </Link>
            <IconButton color="primary" title="Delete" onClick={() => deleteMotivation(index)}>
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
            placeholder="Add a new motivation"
            onBlur={(event) => {
              if (!event.target.value) return;
              addMotivation(event.target.value);
              event.target.value = "";
            }}
            className="grow"
          />
          <IconButton className="invisible">
            <Delete />
          </IconButton>
        </ListItem>
      </List>

      {editingMotivationIndex !== undefined && editingMotivation !== undefined && (
        <Dialog open={true} onClose={() => setEditingMotivationIndex(undefined)}>
          <div className="flex flex-col m-6 gap-2">
            <TextField
              label="Motivation"
              size="small"
              multiline
              defaultValue={editingMotivation.text}
              onBlur={(event) => setMotivationText(editingMotivationIndex, event.target.value)}
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

export const Motivations = ({ next }: Props) => {
  const [editing, setEditing] = useState(false);

  return (
    <div className="size-full flex flex-col text-center">
      {/* body */}
      <div className="flex flex-col grow w-full items-center justify-center">
        {!editing && <CurrentMotivation next={next} />}
        {editing && <EditingMotivations />}
      </div>

      {/* footer */}
      <div className="w-full flex justify-center h-12">
        {!editing && (
          <IconButton color="primary" title="Edit motivations" onClick={() => setEditing(!editing)}>
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
