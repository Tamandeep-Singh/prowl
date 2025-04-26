import { useState, useEffect } from "react";
import ApiService from "../../services/api_service";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import { Container, Grid, Typography, Card, CardContent} from "@mui/material";

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
          </Grid>
        </Container>
    </div>
};

export default CentralDashboard;