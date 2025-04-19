import "../../css/central_dashboard.css";
import { useState, useEffect } from "react";
import ApiService from "../../services/api_service";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';

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
        <div id="card-wrapper">
            <div className="card status__card">
                <span style={{ display: "flex", alignItems: "center"}}>{status === true ? <CheckCircleIcon sx={{ color: "green", fontSize: 25, marginRight: 0.5}}/> : <ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5}}/>}API Status ({ApiService.endpoint})</span>
                    <p>{status === true ? "All systems are operational" : "The API is down, please debug or restart the backend"}</p>
            </div>
            <div className="card events__card">
                <span>Events</span>
            </div>
        </div>
    </div>
};

export default CentralDashboard;