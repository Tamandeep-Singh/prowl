import { DataGrid } from "@mui/x-data-grid";
import ProcessService from "../../services/process_service";
import { useEffect, useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import "../../css/base.css";
import { useNavigate } from "react-router-dom";
import ErrorIcon from '@mui/icons-material/Error';


const Processes = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });

    const columns = [
        {field: "host_name", headerName: "Host Name", width: 160},
        {field: "pid", headerName: "Process ID", width: 100},
        {field: "ppid", headerName: "Parent Process ID", width: 140},
        {field: "user", headerName: "User", width: 100, renderCell: (params) => (
            <Tooltip title={params.value}>
              <span style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                width: '100%',
              }}>
                {params.value}
              </span>
            </Tooltip>
        )},
        {field: "command", headerName: "Command", width: 550, renderCell: (params) => (
            <Tooltip title={params.value}>
              <span style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                width: '100%',
              }}> {params.value}
             </span>
            </Tooltip>
          )},
        {field: "start_time", headerName: "Start Time", width: 300}
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
                    command: process.command,
                    start_time: new Date(process.start_time).toLocaleString("en-GB")
                });
              });
              setRows(processes);
            };
            fetchProcesses();
          }, [navigate]);

    return <div>
       <p id="title">Endpoint Processes {error && <span id="api-error">{<ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5 }} />} Error: {error}</span>}</p>
       <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10]} />
    </div>
};

export default Processes;