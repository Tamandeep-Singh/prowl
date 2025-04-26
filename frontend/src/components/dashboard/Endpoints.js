import "../../css/base.css";
import { DataGrid } from "@mui/x-data-grid";
import EndpointService from "../../services/endpoint_service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import { IconButton } from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";
import { Dialog, DialogTitle, DialogContent, Button, DialogActions } from "@mui/material";

const Endpoints = () => {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
    const [showInformationPopup, setShowInformationPopup] = useState(false);
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });
    const columns = [
        {field: "host_id", headerName: "Host ID", width: 220},
        {field: "host_name", headerName: "Host Name", width: 200},
        {field: "host_ip", headerName: "Host IP", width: 160},
        {field: "host_os", headerName: "OS", width: 200},
        {field: "host_os_version", headerName: "OS Version", width: 200},
        {field: "host_link_date", headerName: "Added On", width: 240},
    ];

    const onShowInformationPopup = () => {
      setShowInformationPopup(true);
    };

    const onCloseShowInformationPopup = () => {
      setShowInformationPopup(false);
    };

    useEffect(() => {
        const fetchEndpoints = async () => {
          const endpoints= [];
          const response = await EndpointService.fetchEndpoints();
          if (response.result.error) {
            if (response.result.invalid) {
                window.localStorage.clear();
                return navigate("/login", {
                  state: {
                    externalError: "Invalid authentication details provided, please relogin."
                  }
                });
            };
            setError("Could not retrieve Endpoints from the API");
            return;
          };
          response.result.forEach(endpoint => {
            endpoints.push({
                id: endpoint.host_uuid,
                host_id: endpoint._id,
                host_name: endpoint.host_name,
                host_ip: endpoint.host_ip,
                host_os: endpoint.host_os,
                host_os_version: endpoint.host_os_version,
                host_link_date: new Date(endpoint.createdAt).toLocaleString("en-GB")
            });
          });
          setRows(endpoints);
        };
        fetchEndpoints();
      }, [navigate]);

    return <div>
      <p id="title">Linked Endpoints <IconButton onClick={onShowInformationPopup} sx={{ marginBottom: 0.1}}><InfoIcon sx={{ color: "white"}}/></IconButton></p>
      {error && <span id="api-error">{<ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5 }} />} Error: {error}</span>}
      <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10]}/>
   <Dialog open={showInformationPopup} onClose={onCloseShowInformationPopup} fullWidth maxWidth="sm">
      <DialogTitle>Linked Endpoints Page Guide</DialogTitle>
      <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
         <p style={{ marginTop: -3, marginBottom: 0 }}>This page details all Endpoints that are linked to Prowl. In particular, the Host ID, Host Name and Host IP are the most crucial identifiers that are repeatedly linked to other artifact collections uch as Endpoint processes, files and network connections. You are able to filter each applicable column for specific properties such as all Endpoints that run on "MacOS" or all Endpoints that share a common prefix or suffix in their Host Name.</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseShowInformationPopup}color="primary">Close</Button>
      </DialogActions>
    </Dialog>
    </div>
};

export default Endpoints;