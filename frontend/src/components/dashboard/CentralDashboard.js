import { useState, useEffect } from "react";
import ApiService from "../../services/api_service";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { Container, Grid, Typography, Card, CardContent, Select, MenuItem, Divider, FormControl, InputLabel} from "@mui/material";
import MemoryIcon from '@mui/icons-material/Memory';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import DescriptionIcon from '@mui/icons-material/Description';
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LaptopIcon from '@mui/icons-material/Laptop';
import EventsService from "../../services/events_service";
import EndpointService from "../../services/endpoint_service";
import AlertService from "../../services/alert_service";
import { LineChart, Line, XAxis, Tooltip, ResponsiveContainer, YAxis, CartesianGrid } from 'recharts';
import dayjs from "dayjs";


const CentralDashboard = () => {
    const [status, setStatus] = useState(false);
    const [counts, setCounts] = useState(null);
    const [endpoints, setEndpoints] = useState([]);
    const [alerts, setAlerts] = useState([]);
    const [endpoint, setEndpoint] = useState("");
    const [range, setRange] = useState('7-days'); 
    const [data, setData] = useState([]);

    const getDateCount = (date, array) => {
        const count = {};
        array.forEach(element => {
            const key = new Date(element.createdAt).toLocaleDateString();
            count[key] = (count[key] || 0) + 1;
        });
        return count[new Date(date).toLocaleDateString()];
    };

    const fetchAlertsByRange = (alerts, range) => {
        const now = dayjs();

        const lastWeek = now.subtract(7, "days");
        const lastMonth = now.subtract(1, "month");
        const lastYear = now.subtract(1, "year");

        const endpointAlerts = alerts.filter(alert => alert.host_name === endpoint);

        switch (range) {
            case "7-days":
                let lastWeekArray = [];
                let lastWeekKeys = {};
                const lastWeekFilter = endpointAlerts.filter(alert => dayjs(alert.createdAt).isAfter(lastWeek));
                lastWeekFilter?.forEach(alert => {
                    const date = new Date(alert.createdAt).toLocaleDateString();
                    if (!lastWeekKeys[date]) {
                        lastWeekArray.push({ date: new Date(alert.createdAt).toLocaleDateString(), [alert.host_name]: getDateCount(alert.createdAt, lastWeekFilter) });
                        lastWeekKeys[date] = true;
                    };
                });
                return lastWeekArray;
            case "1-month":
                let lastMonthArray = [];
                let lastMonthKeys = {};
                const lastMonthFilter = endpointAlerts.filter(alert => dayjs(alert.createdAt).isAfter(lastMonth));
                lastMonthFilter?.forEach(alert => {
                    const date = new Date(alert.createdAt).toLocaleDateString();
                    if (!lastMonthKeys[date]) {
                        lastMonthArray.push({ date: new Date(alert.createdAt).toLocaleDateString(), [alert.host_name]: getDateCount(alert.createdAt, lastMonthFilter) });
                        lastMonthKeys[date] = true;
                    };
                });
                return lastMonthArray;
            case "1-year":
                let lastYearArray = [];
                let lastYearKeys = {};
                const lastYearFilter = endpointAlerts.filter(alert => dayjs(alert.createdAt).isAfter(lastYear));
                lastYearFilter?.forEach(alert => {
                    const date = new Date(alert.createdAt).toLocaleDateString();
                    if (!lastYearKeys[date]) {
                        lastYearArray.push({ date: new Date(alert.createdAt).toLocaleDateString(), [alert.host_name]: getDateCount(alert.createdAt, lastYearFilter) });
                        lastYearKeys[date] = true;
                    };
                });
                return lastYearArray;
            default:
                return [];
        };
    };

    useEffect(() => {
        const pingAPI = async () => {
            const response = await ApiService.ping();
            setStatus(response.result.success);
        };
        pingAPI();

        const fetchEventCounts = async () => {
            const response = await EventsService.fetchEventsCount();
            if (!response.result.error) {
                setCounts(response.result.counts);
            };
        };
        fetchEventCounts();

        const fetchEndpoints = async () => {
            const response = await EndpointService.fetchEndpoints();
            if (!response.result.error) {
                setEndpoints(response.result);
            };
        };
        fetchEndpoints();

        const fetchAlerts = async () => {
            const response = await AlertService.fetchAlerts();
            if (!response.result.error) {
                setAlerts(response.result);
            };
        };
        fetchAlerts();
    }, []);

    useEffect(() => {
        setData(fetchAlertsByRange(alerts, range));

    }, [endpoint, range]);

    return <div>
        <p id="title">Central Dashboard</p>
        <Container sx={{ marginLeft: -0.5 }}>
        <Grid width="100vw" container spacing={3}>
            <Grid item>
                <Card sx={{ width: 380, height: 90, borderRadius: 2}}>
                    <CardContent>
                        <Typography sx={{ fontSize: 18}}>{status === true ? <CheckCircleIcon sx={{ color: "green", fontSize: 22, marginRight: 0.5, marginBottom: -0.45, marginLeft: -0.5}}/> : <ErrorIcon sx={{ color: "red", fontSize: 22, marginRight: 0.5, marginBottom: -0.45, marginLeft: -0.5}}/>}API Status: ({ApiService.endpoint})</Typography>
                        <Typography sx={{ fontSize: 14, marginTop: 0.5}} color="text.secondary">{status === true ? "All systems are operational" : "The API is down, please debug or restart the backend"}</Typography>
                    </CardContent>
                </Card>
                <Card sx={{ width: 380, height: 350, borderRadius: 2, marginTop: 2.5}}>
                    <CardContent>
                        <Typography sx={{ fontSize: 18 }} variant="h5">Processed Events (All Endpoints)</Typography>
                        <Divider sx={{ marginBottom: 1.5, marginTop: 0.9}}/>
                        <Typography sx={{ marginBottom: 1.8}}><span>{<LaptopIcon sx={{ marginBottom: -0.8, marginRight: 0.8, marginLeft: -0.6, color: "#1976d2"}}/>}Linked Endpoints: {counts ? counts.endpoints : 0}</span></Typography>
                        <Typography sx={{ marginBottom: 1.8}}><span>{<MemoryIcon sx={{ marginBottom: -0.8, marginRight: 0.8, marginLeft: -0.6, color: "#1976d2"}}/>}Processes: {counts ? counts.processes : 0}</span></Typography>
                        <Typography sx={{ marginBottom: 1.8}}><span>{<NetworkWifiIcon sx={{ marginBottom: -0.8, marginRight: 0.8, marginLeft: -0.6, color: "#1976d2"}}/>}Network Connections: {counts ? counts.networkConnections : 0}</span></Typography>
                        <Typography sx={{ marginBottom: 1.8}}><span>{<DescriptionIcon sx={{ marginBottom: -0.8, marginRight: 0.8, marginLeft: -0.6, color: "#1976d2"}}/>}Files: {counts ? counts.files : 0}</span></Typography>
                        <Divider sx={{ marginBottom: 1.5, marginTop: 0.9}}/>
                        <Typography sx={{ fontSize: 18, marginBottom: 1.8}}>Alerts and Reports</Typography>
                        <Typography sx={{ marginBottom: 1.8}}><span>{<CircleNotificationsIcon sx={{ marginBottom: -0.8, marginRight: 0.8, marginLeft: -0.6, color: "#1976d2"}}/>}Alerts: {counts ? counts.alerts : 0}</span></Typography>
                        <Typography sx={{ marginBottom: 1.8}}><span>{<AssessmentIcon sx={{ marginBottom: -0.8, marginRight: 0.8, marginLeft: -0.6, color: "#1976d2"}}/>}Generated Reports: {counts ? counts.reports : 0}</span></Typography>
                    </CardContent>
                </Card>
            </Grid>
            <Grid item>
            <Card sx={{width: "58vw"}}>
                <CardContent>
                    <Typography sx={{ fontSize: 22 }} variant="h5" gutterBottom>Endpoint Alert Activity</Typography>
                    <FormControl sx={{ marginLeft: 0, width: 200, marginBottom: 1.8, marginTop: 1.5 }}>
                        <InputLabel>Endpoint</InputLabel>
                        <Select value={endpoint} onChange={({ target }) => setEndpoint(target.value)} label="Select Endpoint">
                            {endpoints.map(endpoint => <MenuItem key={endpoint._id} value={endpoint.host_name}>{endpoint.host_name}</MenuItem>)}
                        </Select>
                    </FormControl>
                    <FormControl sx={{ marginLeft: 3, marginBottom: 1.8, marginTop: 1.5 }}>
                        <InputLabel>Range</InputLabel>
                        <Select value={range} onChange={({ target }) => setRange(target.value)} label="Select Range">
                            <MenuItem value="7-days">Last 7 Days</MenuItem>
                            <MenuItem value="1-month">Last Month</MenuItem>
                            <MenuItem value="1-year">Last Year</MenuItem>
                        </Select>
                    </FormControl>
                    <ResponsiveContainer height={300}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="4 4"/>
                            <XAxis dataKey="date"/>
                            <YAxis/>
                            <Tooltip/>
                            <Line type="monotone" dataKey={endpoint} stroke="#8884d8"/>
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
            </Grid>
        </Grid>
        </Container>
    </div>
};

export default CentralDashboard;