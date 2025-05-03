import "../../css/base.css";
import { useEffect, useState } from "react";
import ErrorIcon from "@mui/icons-material/Error";
import InfoIcon from "@mui/icons-material/Info";
import { IconButton } from "@mui/material";
import Tooltip from "@mui/material/Tooltip";
import { Dialog, DialogTitle, DialogContent, Button, DialogActions, CircularProgress} from "@mui/material";
import { Card, CardContent, Typography} from "@mui/material";
import GitHubIcon from '@mui/icons-material/GitHub';
import ApiService from "../../services/api_service";
import OauthService from "../../services/oauth_service";
import { DataGrid } from "@mui/x-data-grid";

const Github = () => {
    const [error, setError] = useState("");
    const [rows, setRows] = useState(null);
    const [loading, setLoading] = useState(true);
    const [analysing, setAnalysing] = useState(false);
    const [showReportPopup, setShowReportPopup] = useState(false);
    const [repoReport, SetRepoReport] = useState(null);
    const [showInformationPopup, setShowInformationPopup] = useState(false);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });
    const [sortModel, setSortModel] = useState([
        { field: "created_at", sort: "desc"},
    ]);

    const onAnalyseGithubRepo = async (repo) => {
        setShowReportPopup(true);
        SetRepoReport(null);
        setAnalysing(true);
        const response = await OauthService.analyseGithubRepo(repo);
        setAnalysing(false);
        if (!response.result.error) {
            SetRepoReport(response.result);

            const blob = new Blob([JSON.stringify(response.result, null, 2)], {
                type: 'application/json',
            });
            
            const download_url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = download_url;
            link.download = `${repo.name}-${Math.floor(new Date().getTime() / 1000)}_report.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(download_url);
        };

    };
    
    const columns = [
        {field: "id", headerName: "Repo ID", width: 100},
        {field: "name", headerName: "Repo Name", width: 160, renderCell: (params) => (
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
        {field: "visibility", headerName: "Repo Visbility", width: 120},
        {field: "html_url", headerName: "Repo URL", width: 380, renderCell: (params) => (
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
        {field: "created_at", headerName: "Created At", type: "dateTime", width: 200},
        {field: "updated_at", headerName: "Updated At", type: "dateTime", width: 200},
        {field: "analyse_repo", headerName: "Actions", width: 210, sortable: false, filterable: false, renderCell: (params) => (
            <Button variant="contained" onClick={() => onAnalyseGithubRepo(params.row)} size="small">Analyse Repo</Button>),
        } 
    ];

    const onShowInformationPopup = () => {
        setShowInformationPopup(true);
    };
  
    const onCloseShowInformationPopup = () => {
        setShowInformationPopup(false);
    };

    const renderGithubSignIn = () => {
        return <div style={{ width: "80vw", display: "flex", justifyContent: "center"}}>
            <Card sx = {{ height: 280, width: 400, borderRadius: 2}}>
            <GitHubIcon sx={{ display: "block", marginX: "auto", marginTop: 3, fontSize: 60}}/>
            <CardContent>
                <Typography variant="h5" sx={{ marginTop: 0.8, textAlign: "center", fontSize: 28}}>Sign In</Typography>
                <Typography sx={{ fontSize: 15, marginTop: 1, textAlign: "center"}} color="text.secondary">Sign in to continue to Github</Typography>
                <Button onClick={() => window.location.replace(`${ApiService.endpoint}/api/oauth/github`)} variant="contained" sx={{ display: "block", marginX: "auto", marginTop: 3}}>Sign In with Github</Button>
        </CardContent>
        </Card>
        </div>
    };

    const renderReposDataGrid = () => {
        return <div><DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10]} sortModel={sortModel} onSortModelChange={setSortModel}/>
          <Dialog open={showReportPopup} onClose={() => setShowReportPopup(false)} fullWidth maxWidth="sm">
                <DialogTitle>{analysing === true ? "Analysing Repo": "Repo Analysed"}</DialogTitle>
                <DialogContent dividers sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
                  {analysing ? (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "2rem" }}>
                      <CircularProgress/>
                      <p>Analysing...</p>
                    </div>
                  ) : repoReport ? (
                    <div>
                        <Typography sx={{ marginBottom: 2 }}>Successfully analysed: <strong>{repoReport.repo.name}</strong></Typography>
                        <Typography sx={{ marginBottom: 2 }}>View the downloaded file for further information on the analysed repo.</Typography>
                    </div>
                  ) : (
                    <Typography color="error">Unable to analyse the repo due to an error. Please check if the API is active or refresh the page so that repos are updated accordingly.</Typography>
                  )}
                </DialogContent>
                <DialogActions>
                  <Button onClick={() => setShowReportPopup(false)} color="primary">Close</Button>
                </DialogActions>
            </Dialog></div>
    };

    useEffect(() => {
        const fetchGithubRepos = async () => {
            const reposArray = []
            const response = await OauthService.getGithubRepos();
            setLoading(false);
            if (response.result.error) {
                setError("Unable to retrieve Github Repos! Please sign in via Github OAuth.");
                return;
            };
            response.result.repos.forEach(repo => {
                reposArray.push({
                    id: repo.id, 
                    name: repo.name,
                    visibility: repo.visibility, 
                    html_url: repo.html_url, 
                    api_url: repo.url,
                    owner: repo.owner.login,
                    created_at: new Date(repo.created_at),
                    updated_at: new Date(repo.updated_at)
                });
            });
            setRows(reposArray);
        };
        fetchGithubRepos();
    }, []);

   return <div>
      <p id="title">Github Integration <IconButton onClick={onShowInformationPopup} sx={{ marginBottom: 0.1}}><InfoIcon sx={{ color: "white"}}/></IconButton></p>
      {error && <span id="api-error">{<ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5 }} />} Error: {error}</span>}
      {loading ? <div></div> : rows ? renderReposDataGrid() : renderGithubSignIn()}
    <Dialog open={showInformationPopup} onClose={onCloseShowInformationPopup} fullWidth maxWidth="sm">
        <DialogTitle>Github Integration: Page Guide</DialogTitle>
        <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
            <p style={{ marginTop: -3, marginBottom: 0 }}>This page lists all Github repos connected to your Github account or the repos that you have access to via other organisations. For each repo, under the <strong>"Actions"</strong> column, you are able to analyse each repo for <strong>sensitive information exposure,</strong> even for private repos in case they ever become public. You can view a <strong>detailed JSON report</strong> after successful analysis which can be exported and used in other systems.<p><strong>Note: </strong>All repos stored on the backend are only kept <strong>temporarily</strong> and deleted after analysis.</p></p>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCloseShowInformationPopup}color="primary">Close</Button>
        </DialogActions>
    </Dialog>
    </div>
};

export default Github;