import "../../css/base.css";
import { DataGrid } from "@mui/x-data-grid";
import AlertService from "../../services/alert_service";
import { useEffect, useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import ReportsService from "../../services/report_service";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Typography, IconButton} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const Alerts = () => {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [showInformationPopup, setShowInformationPopup] = useState(false);
    const [showReportPopup, setShowReportPopup] = useState(false);
    const [reportData, setReportData] = useState(null);
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

    const onCloseReportPopup = () => {
      setLoading(false);
      setReportData(null);
      setShowReportPopup(false);
    };

    const generateReport = async (row) => {
      setLoading(true);
      setShowReportPopup(true);
      const report = await ReportsService.fetchReportByAlertID(row.id);
      if (report.result?.error) {
        setLoading(false);
        return;
      };
      if (report.result !== null) {
        setLoading(false);
        setReportData(report.result);
        return;
      };
      const response = await ReportsService.generateReport({
        alert_id: row.id,
        host_name: row.host_name,
        trigger: row.trigger,
        message: row.message,
        severity: row.severity,
        score: row.score,
      });
      setLoading(false);
      if (!response.result.error) {
        setReportData(response.result);
      };
    };

    const columns = [
        {field: "host_name", headerName: "Host Name", width: 130},
        {field: "artifact_id", headerName: "Artifact ID", width: 220},
        {field: "artifact_collection", headerName: "Artifact Collection", width: 140},
        {field: "trigger", headerName: "Triggered By", width: 150, renderCell: (params) => (
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
        {field: "message", headerName: "Description", width: 110, renderCell: (params) => (
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
        {field: "severity", headerName: "Severity", width: 90},
        {field: "score", headerName: "Score", width: 80},
        {field: "date_added", headerName: "Added On", width: 180},
        {field: "generate_report", headerName: "Actions", width: 240, sortable: false, filterable: false, renderCell: (params) => (
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
                    date_added: new Date(alert.createdAt).toLocaleString("en-GB")
                });
              });
              setRows(alerts);
            };
            fetchAlerts();
          }, [navigate]);

    return <div>
      <p id="title">Endpoint Alerts <IconButton onClick={onShowInformationPopup} sx={{ marginBottom: 0.1}}><InfoIcon sx={{ color: "white"}}/></IconButton></p>
      {error && <span id="api-error">{<ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5 }} />} Error: {error}</span>}
      <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10]} />
  <Dialog open={showReportPopup} onClose={onCloseReportPopup} fullWidth maxWidth="sm">
      <DialogTitle>{loading === true ? "Generating Report" : "Generated Report"}</DialogTitle>
      <DialogContent dividers sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
            <CircularProgress/>
            <p>Analysing...</p>
          </div>
        ) : reportData ? (
          <div>
            <Typography sx={{ marginBottom: 2 }}><strong>Report ID:</strong> {reportData._id}</Typography>
            <Typography sx={{ marginBottom: 2 }}><strong>Alert ID:</strong> {reportData.alert_id}</Typography>
            <Typography sx={{ marginBottom: 2 }}><strong>Trigger:</strong> {reportData.trigger}</Typography>
            <Typography sx={{ marginBottom: 2 }}><strong>Summary:</strong> {reportData.summary}</Typography>
          </div>
        ) : (
          <Typography color="error">Unable to generate the report due to an error.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseReportPopup}color="primary">Close</Button>
      </DialogActions>
    </Dialog>
    <Dialog open={showInformationPopup} onClose={onCloseShowInformationPopup} fullWidth maxWidth="sm">
      <DialogTitle>Endpoint Alerts Page Guide</DialogTitle>
      <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
         <p style={{ marginTop: -3, marginBottom: 0 }}>Hello World</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseShowInformationPopup}color="primary">Close</Button>
      </DialogActions>
    </Dialog>
    </div>
};

export default Alerts;