import Navbar from "./Navbar";
import "../css/Dashboard.css";
import { useState } from "react";
import { Sidebar, Menu, MenuItem, SubMenu, useProSidebar} from 'react-pro-sidebar';
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import DevicesIcon from '@mui/icons-material/Devices';
import MemoryIcon from '@mui/icons-material/Memory';
import NetworkWifiIcon from '@mui/icons-material/NetworkWifi';
import DescriptionIcon from '@mui/icons-material/Description';
import LaptopIcon from '@mui/icons-material/Laptop';
import AssessmentIcon from '@mui/icons-material/Assessment';
import SchoolIcon from '@mui/icons-material/School';
import GitHubIcon from '@mui/icons-material/GitHub';
import Endpoints from "./dashboard/Endpoints";
import Processes from "./dashboard/Processes";
import Files from "./dashboard/Files";
import NetworkConnections from "./dashboard/NetworkConnections";
import CentralDashboard from "./dashboard/CentralDashboard";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloseIcon from '@mui/icons-material/Close';
import Alerts from "./dashboard/Alerts";
import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GroupIcon from '@mui/icons-material/Group';
import AppUtils from "../utils";
import ProwlUsers from "./dashboard/ProwlUsers";

/* Guide for Sidebar followed from: https://blog.logrocket.com/creating-responsive-sidebar-react-pro-sidebar-mui/ */ 

const Dashboard = () => {
    const [screen, setScreen] = useState("central_dashboard");
    const [collapsed, setCollapsed] = useState(false);
    const { collapseSidebar } = useProSidebar();

    return <div id="dashboard-wrapper">
        <Navbar/>
        <div id="sidebar-wrapper">
        <Sidebar rootStyles={{
            borderRight: 'none'
        }}>
        <Menu
            rootStyles={({
                height: "100vh",
                backgroundColor: "#343944"
            })}
            menuItemStyles={{
                button: {
                  backgroundColor: "#343944",
                  [`&:hover`]: {
                    color: "#343944"
                  },
                },
              }}>
            <MenuItem icon={collapsed === true ? <MenuOutlinedIcon/> : <CloseIcon/>} onClick={() => {
                setCollapsed(!collapsed)
                collapseSidebar();
            }}>Collapse</MenuItem>
            <MenuItem onClick={() => setScreen("central_dashboard")} icon={<DashboardIcon/>}>Central Dashboard</MenuItem>
            <SubMenu label="Hosts" icon={<DevicesIcon/>}>
                <MenuItem onClick={() => setScreen("endpoints")} icon={<LaptopIcon/>}>Endpoints</MenuItem>
                <MenuItem onClick={() => setScreen("processes")} icon={<MemoryIcon/>}>Processes</MenuItem>
                <MenuItem onClick={() => setScreen("network_connections")} icon={<NetworkWifiIcon/>}>Network Connections</MenuItem>
                <MenuItem onClick={() => setScreen("files")} icon={<DescriptionIcon/>}>Files</MenuItem>
            </SubMenu>
            <MenuItem onClick={() => setScreen("alerts")} icon={<CircleNotificationsIcon/>}>Alerts</MenuItem>
            <MenuItem onClick={() => setScreen("reports")} icon={<AssessmentIcon/>}>AI Reports</MenuItem>
            <MenuItem icon={<SchoolIcon/>}>Learn</MenuItem>
            <MenuItem icon={<GitHubIcon/>}>GitHub Repositories</MenuItem>
            {AppUtils.isUserAdmin() && <SubMenu label="Admin" icon={<AdminPanelSettingsIcon/>}>
                <MenuItem onClick={() => setScreen("prowl_users")} icon={<GroupIcon/>}>Prowl Users</MenuItem>
            </SubMenu>}
        </Menu>
        </Sidebar>
        {screen === "central_dashboard" && <CentralDashboard/>}
        {screen === "endpoints" && <Endpoints/>}
        {screen === "processes" && <Processes/>}
        {screen === "network_connections" && <NetworkConnections/>}
        {screen === "files" && <Files/>}
        {screen === "alerts" && <Alerts/>}
        {screen === "prowl_users" && <ProwlUsers/>}
        </div>
    </div>
    
};

export default Dashboard;