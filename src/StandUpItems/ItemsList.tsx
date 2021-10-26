import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import StarIcon from "@mui/icons-material/Star";
import CheckIcon from "@mui/icons-material/Check";
import Grid from "@mui/material/Grid";
import ListSubheader from "@mui/material/ListSubheader";
import DoNotDisturbOnIcon from "@mui/icons-material/DoNotDisturbOn";
import AddIcon from "@mui/icons-material/Add";
import { IStandUpItem } from "./Data";
import { useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { addItem } from "./Data";
import { useAuth0 } from "@auth0/auth0-react";

const StandUpItemsList = ({
  data,
  type,
  onItemInserted,
}: {
  data: IStandUpItem[];
  type: "yesterday" | "today" | "blocker";
  onItemInserted: (item: IStandUpItem) => void;
}) => {
  const { user, getAccessTokenSilently } = useAuth0();
  const [isSaving, setIsSaving] = useState<boolean>(false);

  const info = {
    yesterday: {
      title: "Yesterday",
      icon: <CheckIcon />,
      newItemTitle: "What did you do yesterday?",
    },
    today: {
      title: "Today",
      icon: <StarIcon />,
      newItemTitle: "What are you going to do today?",
    },
    blocker: {
      title: "Blockers",
      icon: <DoNotDisturbOnIcon />,
      newItemTitle: "What is stopping you?",
    },
  };

  const [showAddNew, setShowAddNew] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");

  const handleAddNew = () => {
    setShowAddNew(true);
  };

  const handleClose = () => setShowAddNew(false);

  const handleTitleChange = (e: any) => {
    setNewTitle(e.target.value);
  };

  const handleDescChange = (e: any) => {
    setNewDescription(e.target.value);
  };

  const handleNewItem = async () => {
    try {
      if (!isSaving) {
        setIsSaving(true);
        const token = await getAccessTokenSilently();
        const newItem = {
          title: newTitle,
          description: newDescription,
          userId: user?.sub || "",
          type: type,
        };
        await addItem(token, newItem);
        handleClose();
        onItemInserted(newItem);
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Grid item md={4} xs={12}>
      <List
        subheader={
          <ListSubheader component="h2" id={info[type].title}>
            {info[type].title}
          </ListSubheader>
        }
      >
        {data.map((d, i) => (
          <ListItem key={d._id || i}>
            <ListItemIcon>{info[type].icon}</ListItemIcon>
            <ListItemText primary={d.title} secondary={d.description} />
          </ListItem>
        ))}
        <ListItem alignItems="center" style={{ justifyContent: "center" }}>
          <Button
            variant="contained"
            disableElevation
            fullWidth
            onClick={handleAddNew}
          >
            <AddIcon />
          </Button>
        </ListItem>
      </List>
      <Dialog open={showAddNew} onClose={handleClose}>
        <DialogTitle>{info[type].newItemTitle}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="title"
            label="Title"
            fullWidth
            variant="standard"
            onChange={handleTitleChange}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description"
            multiline
            maxRows={5}
            fullWidth
            onChange={handleDescChange}
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" disableElevation onClick={handleNewItem}>
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default StandUpItemsList;
