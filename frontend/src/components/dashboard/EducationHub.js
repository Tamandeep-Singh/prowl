import "../../css/base.css";
import { useState } from "react";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Dialog, DialogTitle, DialogContent, Button, DialogActions, TextField, Chip} from "@mui/material";


const EducationHub = () => {
    const [showInformationPopup, setShowInformationPopup] = useState(false);
    const [selectedTag, setSelectedTag] = useState(null);
  
    const tags = ["Reverse Shell", "Testing", "XSS", "Command and Control (C2)"];

    const onShowInformationPopup = () => {
      setShowInformationPopup(true);
    };

    const onCloseShowInformationPopup = () => {
      setShowInformationPopup(false);
    };

    return <div>
      <p id="title">Education Hub <IconButton onClick={onShowInformationPopup} sx={{ marginBottom: 0.1}}><InfoIcon sx={{ color: "white"}}/></IconButton></p>
      <Dialog open={showInformationPopup} onClose={onCloseShowInformationPopup} fullWidth maxWidth="sm">
          <DialogTitle>Education Hub Page Guide</DialogTitle>
          <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
              <p sx={{ marginBottom: 2 }}>Hello World</p>
          </DialogContent>
          <DialogActions>
              <Button onClick={onCloseShowInformationPopup}color="primary">Close</Button>
          </DialogActions>
    </Dialog>
    <TextField variant="outlined" fullWidth placeholder="Search Articles" sx={{ marginBottom: 2 }}/>
       {tags.map((tag) => (
              <Chip
                key={tag}
                label={tag}
                clickable
                color={selectedTag === tag ? "primary" : "default"}
                onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              />
            ))}
    </div>
};

export default EducationHub;