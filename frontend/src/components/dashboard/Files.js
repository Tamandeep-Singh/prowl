import "../../css/base.css";
import { DataGrid } from "@mui/x-data-grid";
import FileService from "../../services/file_service";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Dialog, DialogTitle, DialogContent, Button, DialogActions } from "@mui/material";

const Files = () => {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
    const [showInformationPopup, setShowInformationPopup] = useState(false);
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });

    const onShowInformationPopup = () => {
      setShowInformationPopup(true);
    };

    const onCloseShowInformationPopup = () => {
      setShowInformationPopup(false);
    };

    const columns = [
        {field: "host_name", headerName: "Host Name", width: 130},
        {field: "file_name", headerName: "File Name", width: 150, renderCell: (params) => (
          <Tooltip title={params.value}>
            <span style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
              width: "100%",
            }}>
              {params.value}
            </span>
          </Tooltip>
      )},
        {field: "file_path", headerName: "File Path", width: 180, renderCell: (params) => (
            <Tooltip title={params.value}>
              <span style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                width: "100%",
              }}>
                {params.value}
              </span>
            </Tooltip>
        )},
        {field: "hash", headerName: "File Hash (SHA-1)", width: 200, renderCell: (params) => (
            <Tooltip title={params.value}>
              <span style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
                width: "100%",
              }}> {params.value}
             </span>
            </Tooltip>
        )},
        {field: "file_size", headerName: "File Size (Bits)", width: 140},
        {field: "file_creation", headerName: "Created At", width: 160},
        {field: "file_modified", headerName: "Modified At", width: 160},
        {field: "file_description", headerName: "File Summary", width: 220, renderCell: (params) => (
          <Tooltip title={params.value}>
            <span style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
              display: "block",
              width: "100%",
            }}> {params.value}
           </span>
          </Tooltip>
      )},

    ];

     useEffect(() => {
            const fetchFiles = async () => {
              const files = [];
              const response = await FileService.fetchFiles();
              if (response.result.error) {
                if (response.result.invalid) {
                    window.localStorage.clear();
                    return navigate("/login", {
                      state: {
                        externalError: "Invalid authentication details provided, please relogin."
                      }
                    });
                };
                setError("Could not retrieve Files from the API");
                return;
              };
              response.result.forEach(file => {
                files.push({
                    id: file._id,
                    host_name: file.host_name || "null",
                    file_name: file.file_name,
                    file_path: file.file_path,
                    hash: file.sha1_hash,
                    file_creation: new Date(file.creation_ts).toLocaleString("en-GB"),
                    file_modified: new Date(file.last_mod_ts).toLocaleString("en-GB"),
                    file_size: file.file_size,
                    file_description: file.file_description
                });
              });
              setRows(files);
            };
            fetchFiles();
          }, [navigate]);

    return <div>
      <p id="title">Endpoint Files <IconButton onClick={onShowInformationPopup} sx={{ marginBottom: 0.1}}><InfoIcon sx={{ color: "white"}}/></IconButton></p>
      {error && <span id="api-error">{<ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5 }} />} Error: {error}</span>}
      <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10]} />
   <Dialog open={showInformationPopup} onClose={onCloseShowInformationPopup} fullWidth maxWidth="sm">
      <DialogTitle>Endpoint Files Page Guide</DialogTitle>
      <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
         <p style={{ marginTop: -3, marginBottom: 0 }}>Hello World</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseShowInformationPopup}color="primary">Close</Button>
      </DialogActions>
    </Dialog>
    </div>
};

export default Files;