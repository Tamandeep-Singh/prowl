import { useState, useEffect } from "react";
import ApiService from "../../services/api_service";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { Container, Grid, Typography, Card, CardContent, Divider } from "@mui/material";
import MemoryIcon from '@mui/icons-material/Memory';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import DescriptionIcon from '@mui/icons-material/Description';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AssessmentIcon from '@mui/icons-material/Assessment';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
    { name: "Critical", count: 12 },
    { name: "High", count: 30 },
    { name: "Medium", count: 45 },
    { name: "Low", count: 20 },
];

const CentralDashboard = () => {
    const [status, setStatus] = useState(false);

    useEffect(() => {
        const pingAPI = async () => {
            const response = await ApiService.ping();
            setStatus(response.result.success);
        };
        pingAPI();
    }, []);

    return <div>
        <p id="title">Central Dashboard</p>
        <Container sx={{ marginLeft: -0.5}}>
          <Grid container spacing={3}>
            <Grid item>
                <Card sx={{ width: 380, height: 90, borderRadius: 2}}>
                    <CardContent>
                        <Typography sx={{ fontSize: 18}}>{status === true ? <CheckCircleIcon sx={{ color: "green", fontSize: 22, marginRight: 0.5, marginBottom: -0.45, marginLeft: -0.5}}/> : <ErrorIcon sx={{ color: "red", fontSize: 22, marginRight: 0.5, marginBottom: -0.45, marginLeft: -0.5}}/>}API Status: ({ApiService.endpoint})</Typography>
                        <Typography sx={{ fontSize: 14, marginTop: 0.5}} color="text.secondary">{status === true ? "All systems are operational" : "The API is down, please debug or restart the backend"}</Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item>
                <Card sx={{ width: 380, height: 320, borderRadius: 2}}>
                    <CardContent>
                        <Typography sx={{ fontSize: 18 }} variant="h5">Processed Events (All Endpoints)</Typography>
                        <Divider sx={{ marginBottom: 1.5, marginTop: 0.9}}/>
                        <Typography sx={{ marginBottom: 1.8}}><span>{<MemoryIcon sx={{ marginBottom: -0.8, marginRight: 0.8, marginLeft: -0.6, color: "#1976d2"}}/>}Processes: 2</span></Typography>
                        <Typography sx={{ marginBottom: 1.8}}><span>{<NetworkWifiIcon sx={{ marginBottom: -0.8, marginRight: 0.8, marginLeft: -0.6, color: "#1976d2"}}/>}Network Connections: 2</span></Typography>
                        <Typography sx={{ marginBottom: 1.8}}><span>{<DescriptionIcon sx={{ marginBottom: -0.8, marginRight: 0.8, marginLeft: -0.6, color: "#1976d2"}}/>}Files: 2</span></Typography>
                        <Divider sx={{ marginBottom: 1.5, marginTop: 0.9}}/>
                        <Typography sx={{ fontSize: 18, marginBottom: 1.8}}>Alerts and Reports</Typography>
                        <Typography sx={{ marginBottom: 1.8}}><span>{<CircleNotificationsIcon sx={{ marginBottom: -0.8, marginRight: 0.8, marginLeft: -0.6, color: "#1976d2"}}/>}Alerts: 2</span></Typography>
                        <Typography sx={{ marginBottom: 1.8}}><span>{<AssessmentIcon sx={{ marginBottom: -0.8, marginRight: 0.8, marginLeft: -0.6, color: "#1976d2"}}/>}Generated Reports: 2</span></Typography>
                    </CardContent>
                </Card>
            </Grid>
          </Grid>
        </Container>
    </div>
};

export default CentralDashboard;