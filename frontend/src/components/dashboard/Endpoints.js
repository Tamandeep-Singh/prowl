import { DataGrid } from "@mui/x-data-grid";
import EndpointService from "../../services/endpoint_service";
import { useEffect, useState } from "react";
import "./css/Endpoints.css"

const Endpoints = () => {
    const [endpoints, setEndpoints] = useState([]);
    const [rows, setRows] = useState([]);
    const columns = [
        {field: "host_id", headerName: "Host ID", width: 220},
        {field: "host_name", headerName: "Host Name", width: 180},
        {field: "host_ip", headerName: "Host IP", width: 140},
        {field: "host_os", headerName: "OS", width: 115},
        {field: "host_os_version", headerName: "OS Version", width: 200},
        {field: "host_link_date", headerName: "Added On", width: 200},
    ];

    useEffect(() => {
        const fetchEndpoints = async () => {
          const endpointRows = [];
          const response = await EndpointService.fetchEndpoints();
          if (response.result.error) {
            return;
          };
          response.result.map(endpoint => {
            endpointRows.push({
                id: endpoint.host_uuid,
                host_id: endpoint._id,
                host_name: endpoint.host_name,
                host_ip: endpoint.host_ip,
                host_os: endpoint.host_os,
                host_os_version: endpoint.host_os_version,
                host_link_date: new Date(endpoint.createdAt).toLocaleDateString("en-GB")
            });
          });
          setEndpoints(response.result);
          setRows(endpointRows);
        };
        fetchEndpoints();
      }, []);

    return <div>
       <p id="title" >Linked Endpoints</p>
       <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight />
    </div>
};

export default Endpoints;