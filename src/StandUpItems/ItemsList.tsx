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
import { deleteItem, IStandUpItem } from "./Data";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { addItem } from "./Data";
import { useAuth0 } from "@auth0/auth0-react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ListItemButton } from "@mui/material";

const StandUpItemsList = ({
  data,
  type,
  onItemInserted,
  onItemDeleted,
}: {
  data: IStandUpItem[];
  type: "yesterday" | "today" | "blocker";
  onItemInserted: (item: IStandUpItem) => void;
  onItemDeleted: (id: string) => void;
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
  const [token, setToken] = useState("");

  const getAccessToken = async () => {
    const myToken = await getAccessTokenSilently();
    setToken(myToken);
  };

  useEffect(() => {
    getAccessToken();
  // eslint-disable-next-line
  }, []);

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

  const handleDelete = async (id: string | undefined) => {
    await deleteItem(token, id || "");
    onItemDeleted(id || "");
  };

  const handleNewItem = async () => {
    if (!isSaving) {
      setIsSaving(true);
      const newItem = {
        title: newTitle,
        description: newDescription,
        userId: user?.sub || "",
        type: type,
      };
      const savedItem = await addItem(token, newItem);
      onItemInserted(savedItem);
      handleClose();
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
            <ListItemButton
              alignItems="center"
              sx={{ justifyContent: "flex-end", flexGrow: 0 }}
              onClick={() => {
                handleDelete(d._id);
              }}
            >
              <DeleteIcon />
            </ListItemButton>
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
          <Button
            disabled={isSaving}
            variant="contained"
            disableElevation
            onClick={handleNewItem}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default StandUpItemsList;
