import { DataGrid } from "@mui/x-data-grid";
import NetworkConnectionService from "../../services/network_connection_service";
import { useEffect, useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import "./css/base.css"
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";

const NetworkConnections = () => {
    const [rows, setRows] = useState([]);
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });

    const columns = [
        {field: "host_name", headerName: "Host Name", width: 130},
        {field: "command", headerName: "Command", width: 180, renderCell: (params) => (
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
        {field: "pid", headerName: "Process ID", width: 120},
        {field: "local_ip", headerName: "Local Address IP", width: 140},
        {field: "local_port", headerName: "Local Address Port", width: 140},
        {field: "remote_ip", headerName: "Remote Address IP", width: 140},
        {field: "remote_port", headerName: "Remote Port", width: 110},
        {field: "status", headerName: "Connection Status", width: 160},
        {field: "date_added", headerName: "Date Added", width: 220},
        
    ];

     useEffect(() => {
            const fetchNetworkConnections = async () => {
              const connections = [];
              const response = await NetworkConnectionService.fetchNetworkConnections();
              if (response.result.error) {
                if (response.result.invalid) {
                    window.localStorage.clear();
                    return navigate("/login", {
                      state: {
                        externalError: "Invalid authentication details provided, please relogin."
                      }
                    });
                };
                setError("Could not retrieve Network Connections from the API");
                return;
              };
              response.result.forEach(connection => {
                connections.push({
                  id: connection._id,
                  host_name: connection.host_name || "null",
                  command: connection.command,
                  pid: connection.pid,
                  local_ip: connection.local_address_ip,
                  local_port: connection.local_address_port,
                  remote_ip: connection.remote_address_ip,
                  remote_port: connection.remote_address_port,
                  status: connection.connection_status,
                  date_added: new Date(connection.createdAt).toLocaleString("en-GB")
                });
              });
              setRows(connections);
            };
            fetchNetworkConnections();
          }, [navigate]);

    return <div>
       <p id="title">Endpoint Network Connections {error && <span id="api-error">{<ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5 }} />} Error: {error}</span>}</p>
       <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10]} />
    </div>
};

export default NetworkConnections;