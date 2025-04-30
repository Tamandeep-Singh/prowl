import "../../css/base.css";
import { DataGrid } from "@mui/x-data-grid";
import ProcessService from "../../services/process_service";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Dialog, DialogTitle, DialogContent, Button, DialogActions } from "@mui/material";


const Processes = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [showInformationPopup, setShowInformationPopup] = useState(false);
    const [error, setError] = useState("");
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });
    const [sortModel, setSortModel] = useState([
      { field: "start_time", sort: "desc"},
    ]);

    const onShowInformationPopup = () => {
      setShowInformationPopup(true);
    };

    const onCloseShowInformationPopup = () => {
      setShowInformationPopup(false);
    };

    const columns = [
        {field: "host_name", headerName: "Host Name", width: 160},
        {field: "pid", headerName: "Process ID", width: 100},
        {field: "ppid", headerName: "Parent Process ID", width: 140},
        {field: "user", headerName: "User", width: 100, renderCell: (params) => (
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
        {field: "state", headerName: "State", width: 80},
        {field: "command", headerName: "Command", width: 550, renderCell: (params) => (
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
        {field: "start_time", headerName: "Start Time", width: 250}
    ];

     useEffect(() => {
            const fetchProcesses = async () => {
              const processes = [];
              const response = await ProcessService.fetchProcesses();
              if (response.result.error) {
                if (response.result.invalid) {
                    window.localStorage.clear();
                    return navigate("/login", {
                      state: {
                        externalError: "Invalid authentication details provided, please relogin."
                      }
                    });
                };
                setError("Could not retrieve Processes from the API");
                return;
              };
              response.result.forEach(process => {
                processes.push({
                    id: process._id,
                    host_name: process.host_name,
                    pid: process.pid,
                    ppid: process.ppid,
                    user: process.user,
                    state: process.state || "",
                    command: process.command,
                    start_time: new Date(process.start_time).toLocaleString("en-GB")
                });
              });
              setRows(processes);
            };
            fetchProcesses();
          }, [navigate]);

    return <div>
      <p id="title">Endpoint Processes <IconButton onClick={onShowInformationPopup} sx={{ marginBottom: 0.1}}><InfoIcon sx={{ color: "white"}}/></IconButton></p>
      {error && <span id="api-error">{<ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5 }} />} Error: {error}</span>}
      <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10]} sortModel={sortModel} onSortModelChange={setSortModel}/>
   <Dialog open={showInformationPopup} onClose={onCloseShowInformationPopup} fullWidth maxWidth="sm">
      <DialogTitle>Endpoint Processes: Page Guide</DialogTitle>
      <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
         <p style={{ marginTop: -3, marginBottom: 0 }}>This page lists all Endpoint telemetry gathered by the agent scripts for process activity. For persistent processes, you can copy the <strong>Process ID</strong> and go to the <a href="/endpoint-rtc">Endpoint RTC Dashboard</a> to directly interact with the process.</p>
         <p>As for the table, you can filter for <strong>Parent Process IDs</strong> to view the hierarchy of processes alongside filtering by the <strong>Start Time</strong> to view the newest processes executed on the Endpoint(s) or perform additional analysis.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseShowInformationPopup}color="primary">Close</Button>
      </DialogActions>
    </Dialog>
    </div>
};

export default Processes;