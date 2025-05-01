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
        {field: "host_name", headerName: "Host Name", width: 160},
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
        {field: "hash", headerName: "File Hash (SHA-256)", width: 200, renderCell: (params) => (
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
        {field: "file_creation", headerName: "Created At", type: "dateTime", width: 160},
        {field: "file_modified", headerName: "Modified At", type: "dateTime", width: 160},
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
                    host_name: file.host_name,
                    file_name: file.file_name,
                    file_path: file.file_path,
                    hash: file.sha256_hash,
                    file_creation: new Date(file.creation_ts),
                    file_modified: new Date(file.last_mod_ts),
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
  pageSizeOptions={[5, 10]}/>
   <Dialog open={showInformationPopup} onClose={onCloseShowInformationPopup} fullWidth maxWidth="sm">
      <DialogTitle>Endpoint Files: Page Guide</DialogTitle>
      <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
         <p style={{ marginTop: -3, marginBottom: 0 }}>This page lists all Endpoint telemetry gathered by the agent scripts for file activity. The agent scripts only collect file data for critical directories as collecting telemetry for the entire disk multiple times would significantly consume resources. As with all of the tables, you are able to filter each column to perform <strong>queries</strong> like finding all files on a Windows Host or filtering malicious files with a SHA-256 Hash.</p>
         <p>To view all files on an Endpoint or to examine further file data, please go to the <a href="/endpoint-rtc">Endpoint RTC Dashboard</a> to issue commands.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseShowInformationPopup}color="primary">Close</Button>
      </DialogActions>
    </Dialog>
    </div>
};

export default Files;