import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  DialogActions,
  Button,
} from "@mui/material";
import "@xyflow/react/dist/style.css";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: any) => void;
  existingNodes: any[];
}

export const AddRelativeModal = ({
  isOpen,
  onClose,
  onAdd,
  existingNodes,
}: Props) => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    interests: "",
    requirements: "",
    connectedToId: "",
  });

  const handleSubmit = () => {
    onAdd(formData);
    setFormData({
      name: "",
      bio: "",
      location: "",
      interests: "",
      requirements: "",
      connectedToId: "",
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            backgroundColor: "#161B07",
            color: "white",
            minWidth: "400px",
          },
        },
      }}
    >
      <DialogTitle sx={{ color: "#97bb52", fontWeight: 800 }}>
        Add a Relative
      </DialogTitle>
      <DialogContent
        sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 2 }}
      >
        <TextField
          label="Name"
          fullWidth
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          sx={{ fieldset: { borderColor: "rgba(255,255,255,0.3)" } }}
          slotProps={{
            inputLabel: { style: { color: "white" } },
            input: { style: { color: "white" } },
          }}
        />

        <FormControl fullWidth>
          <InputLabel sx={{ color: "white" }}>Connected To</InputLabel>
          <Select
            value={formData.connectedToId}
            onChange={(e) =>
              setFormData({ ...formData, connectedToId: e.target.value })
            }
            sx={{
              color: "white",
              ".MuiOutlinedInput-notchedOutline": {
                borderColor: "rgba(255,255,255,0.3)",
              },
            }}
          >
            {existingNodes.map((node) => (
              <MenuItem key={node.id} value={node.id}>
                {node.data.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Location"
          fullWidth
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          sx={{ fieldset: { borderColor: "rgba(255,255,255,0.3)" } }}
          slotProps={{
            inputLabel: { style: { color: "white" } },
            input: { style: { color: "white" } },
          }}
        />
        <TextField
          label="Interests"
          fullWidth
          value={formData.interests}
          onChange={(e) =>
            setFormData({ ...formData, interests: e.target.value })
          }
          sx={{ fieldset: { borderColor: "rgba(255,255,255,0.3)" } }}
          slotProps={{
            inputLabel: { style: { color: "white" } },
            input: { style: { color: "white" } },
          }}
        />
        <TextField
          label="Special Requirements"
          fullWidth
          value={formData.requirements}
          onChange={(e) =>
            setFormData({ ...formData, requirements: e.target.value })
          }
          sx={{ fieldset: { borderColor: "rgba(255,255,255,0.3)" } }}
          slotProps={{
            inputLabel: { style: { color: "white" } },
            input: { style: { color: "white" } },
          }}
        />
        <TextField
          label="Archive Bio"
          fullWidth
          multiline
          rows={3}
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          sx={{ fieldset: { borderColor: "rgba(255,255,255,0.3)" } }}
          slotProps={{
            inputLabel: { style: { color: "white" } },
            input: { style: { color: "white" } },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} sx={{ color: "white" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{ backgroundColor: "#97bb52", color: "black" }}
        >
          Save to Legacy Hub
        </Button>
      </DialogActions>
    </Dialog>
  );
};
