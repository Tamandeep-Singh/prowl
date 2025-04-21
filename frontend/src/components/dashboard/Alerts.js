import "../../css/base.css";
import { DataGrid } from "@mui/x-data-grid";
import AlertService from "../../services/alert_service";
import { useEffect, useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import Button from "@mui/material/Button";
import ReportsService from "../../services/report_service";

const Alerts = () => {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });

    const generateReport = async (row) => {
      const response = await ReportsService.generateReport({
        alert_id: row.id,
        host_name: row.host_name,
        trigger: row.trigger,
        message: row.message,
        severity: row.severity,
        score: row.score,
      });
      console.log(response)
    };

    const columns = [
        {field: "host_name", headerName: "Host Name", width: 130},
        {field: "artifact_id", headerName: "Artifact ID", width: 220},
        {field: "artifact_collection", headerName: "Artifact Collection", width: 140},
        {field: "trigger", headerName: "Triggered By", width: 150, renderCell: (params) => (
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
        {field: "message", headerName: "Description", width: 110, renderCell: (params) => (
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
        {field: "severity", headerName: "Severity", width: 90},
        {field: "score", headerName: "Score", width: 80},
        {field: "date_added", headerName: "Added On", width: 180},
        {field: 'generate_report', headerName: 'Dynamic Analysis', width: 240, sortable: false, filterable: false, renderCell: (params) => (
            <Button variant="contained" size="small" onClick={() => generateReport(params.row)}>Generate Report</Button>),
        } 
    ];

     useEffect(() => {
            const fetchAlerts = async () => {
              const alerts = [];
              const response = await AlertService.fetchAlerts();
              if (response.result.error) {
                if (response.result.invalid) {
                    window.localStorage.clear();
                    return navigate("/login", {
                      state: {
                        externalError: "Invalid authentication details provided, please relogin."
                      }
                    });
                };
                setError("Could not retrieve Alerts from the API");
                return;
              };
              response.result.forEach(alert => {
                alerts.push({
                    id: alert._id,
                    host_name: alert.host_name,
                    artifact_id: alert.artifact_id,
                    artifact_collection: alert.artifact_collection,
                    trigger: alert.trigger,
                    message: alert.message,
                    severity: alert.severity,
                    score: alert.score,
                    date_added: new Date(alert.createdAt).toLocaleString('en-GB')
                });
              });
              setRows(alerts);
            };
            fetchAlerts();
          }, [navigate]);

    return <div>
       <p id="title">Endpoint Alerts {error && <span id="api-error">{<ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5 }} />} Error: {error}</span>}</p>
       <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10]} />
    </div>
};

export default Alerts;