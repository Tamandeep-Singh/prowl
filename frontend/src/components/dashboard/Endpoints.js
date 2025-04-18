import { DataGrid } from "@mui/x-data-grid";
import EndpointService from "../../services/endpoint_service";
import { useEffect, useState } from "react";
import "./css/base.css"
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";

const Endpoints = () => {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
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
       <p id="title">Linked Endpoints {error && <span id="api-error">{<ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5 }} />} Error: {error}</span>}</p>
       <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10]}/>
    </div>
};

export default Endpoints;