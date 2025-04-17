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

/* Guide for Sidebar followed from: https://blog.logrocket.com/creating-responsive-sidebar-react-pro-sidebar-mui/ */ 

const Dashboard = () => {
    const [screen, setScreen] = useState("main");
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
            <MenuItem icon={<MenuOutlinedIcon/>} onClick={() => {
                collapseSidebar();
            }}>Dashboard</MenuItem>
            <SubMenu label="Hosts" icon={<DevicesIcon/>}>
                <MenuItem onClick={() => setScreen("endpoints")} icon={<LaptopIcon/>}>Endpoints</MenuItem>
                <MenuItem onClick={() => setScreen("processes")} icon={<MemoryIcon/>}>Processes</MenuItem>
                <MenuItem icon={<NetworkWifiIcon/>}>Network Connections</MenuItem>
                <MenuItem icon={<DescriptionIcon/>}>Files</MenuItem>
            </SubMenu>
            <MenuItem onClick={() => setScreen("reports")} icon={<AssessmentIcon/>}>AI Reports</MenuItem>
            <MenuItem icon={<SchoolIcon/>}>Learn</MenuItem>
            <MenuItem icon={<GitHubIcon/>}>GitHub Repositories</MenuItem>
        </Menu>
        </Sidebar>
        {screen === "endpoints" && <Endpoints/>}
        {screen === "processes" && <Processes/>}
        </div>
    </div>
    
};

export default Dashboard;