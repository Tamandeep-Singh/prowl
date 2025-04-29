import "../../css/base.css";
import { DataGrid } from "@mui/x-data-grid";
import ReportsService from "../../services/report_service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Tooltip, IconButton} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const Reports = () => {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
    const [showReportPopup, setShowReportPopup] = useState(false);
    const [showInformationPopup, setShowInformationPopup] = useState(false);
    const [reportData, setReportData] = useState(null);
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });
    const [sortModel, setSortModel] = useState([
      { field: "date_added", sort: "desc"},
    ]);

    const onShowInformationPopup = () => {
      setShowInformationPopup(true);
    };

    const onCloseShowInformationPopup = () => {
      setShowInformationPopup(false);
    };

    const onCloseReportPopup = () => {
        setShowReportPopup(false);
        setReportData(null);
    };

    const onShowReportPopup = (row) => {
        setShowReportPopup(true);
        setReportData(row);
    };

    const columns = [
        {field: "id", headerName: "Report ID", width: 220},
        {field: "alert_id", headerName: "Alert ID", width: 220},
        {field: "host_name", headerName: "Host Name", width: 160, renderCell: (params) => (
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
        {field: "trigger", headerName: "Trigger", width: 180, renderCell: (params) => (
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
        {field: "summary", headerName: "Report Summary", width: 160},
        {field: "date_added", headerName: "Added On", width: 200},
        {field: "view_report", headerName: "Actions", width: 240, sortable: false, filterable: false, renderCell: (params) => (
            <Button variant="contained" onClick={() => onShowReportPopup(params.row)} size="small">View Report</Button>),
        } 
    ];

    useEffect(() => {
        const fetchReports = async () => {
          const reports = [];
          const response = await ReportsService.fetchReports();
          if (response.result.error) {
            if (response.result.invalid) {
                window.localStorage.clear();
                return navigate("/login", {
                  state: {
                    externalError: "Invalid authentication details provided, please relogin."
                  }
                });
            };
            setError("Could not retrieve Reports from the API");
            return;
          };
          response.result.forEach(report => {
            reports.push({
                id: report._id,
                alert_id: report.alert_id,
                host_name: report.host_name,
                trigger: report.trigger,
                summary: report.summary,
                date_added: new Date(report.createdAt).toLocaleString("en-GB")
            });
          });
          setRows(reports);
        };
        fetchReports();
      }, [navigate]);

    return <div>
      <p id="title">AI Reports <IconButton onClick={onShowInformationPopup} sx={{ marginBottom: 0.1}}><InfoIcon sx={{ color: "white"}}/></IconButton></p>
      {error && <span id="api-error">{<ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5 }} />} Error: {error}</span>}
      <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10]} sortModel={sortModel} onSortModelChange={setSortModel}/>
  <Dialog open={showReportPopup} onClose={onCloseReportPopup} fullWidth maxWidth="sm">
      <DialogTitle>Generated Report</DialogTitle>
      <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
        {reportData ? (<div>
            <Typography sx={{ marginBottom: 2 }}><strong>Report ID:</strong> {reportData.id}</Typography>
            <Typography sx={{ marginBottom: 2 }}><strong>Alert ID:</strong> {reportData.alert_id}</Typography>
            <Typography sx={{ marginBottom: 2 }}><strong>Trigger:</strong> {reportData.trigger}</Typography>
            <Typography sx={{ marginBottom: 2 }}><strong>Summary:</strong> {reportData.summary}</Typography>
        </div>) : <div></div>}
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseReportPopup}color="primary">Close</Button>
      </DialogActions>
    </Dialog>
    <Dialog open={showInformationPopup} onClose={onCloseShowInformationPopup} fullWidth maxWidth="sm">
      <DialogTitle>AI Reports: Page Guide</DialogTitle>
      <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
         <p style={{ marginTop: -3, marginBottom: 0 }}>This page lists all <strong>AI (Artificial Intelligence)</strong> reports that were generated by a Prowl User to further analyse a specific alert. To view further details about the alert, please copy the <strong>"Alert ID"</strong> and filter for that ID in the <a href="/dashboard/alerts">Alerts</a> Dashboard.</p>
        <p><strong>Note: </strong>AI Reports are generated by <strong>Google Gemini.</strong></p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseShowInformationPopup} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
    </div>
};

export default Reports;