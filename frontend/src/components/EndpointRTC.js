import { useEffect, useState } from "react";
import EndpointService from "../services/endpoint_service";
import Navbar from "./Navbar";
import Select from 'react-select';
import "../css/EndpointRTC.css";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const EndpointRTC = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [endpoint, setEndpoint] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
  const [sessionTime, setSessionTime] = useState("");
  const [showInformationPopup, setShowInformationPopup] = useState(false);

  const onShowInformationPopup = () => {
    setShowInformationPopup(true);
  };

  const onCloseShowInformationPopup = () => {
    setShowInformationPopup(false);
  };
  

  const onConnectToEndpoint = async (event) => {
    if (endpoint === null) {
      event.preventDefault();
      setCommandHistory((history) => [...history, "> No endpoint is selected or is invalid to connect to! \n"]);
      return;
    };
    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");

    if(usernameInput.checkValidity() && passwordInput.checkValidity()) {
      event.preventDefault();
      setCommandHistory((history) => [...history, "> Attempting to establish the SSH session, please wait... \n"]);
      const response = await EndpointService.connectToEndpoint(endpoint.host_id, endpoint.host_ip, username, password);
      if (response.result.error) {
        setCommandHistory((history) => [...history, "> Error connecting to the endpoint! \n"]);
        return;
      };
      const session_time = new Date(Date.now());
      setSessionTime(session_time);
      setCommandHistory((history) => [...history, `> Connected to: ${username}@${endpoint.host_ip}, platform: ${endpoint.platform}, session established at: ${session_time} \n`]);
    };
  };

  const handleCommandInputChange = async (event) => {
    setCommand(event.target.value);
  };

  const handleCommandKeyEvent = async (event) => {
    if (event.key === "Enter") {
        event.preventDefault();

        if (endpoint === null) {
          setCommandHistory((history) => [...history, "> Cannot issue command as the endpoint is not connected or invalid!\n"]);
          return;
        };

        if (command === "clear") {
          setCommand("");
          setCommandHistory([]);
          setCommandHistory((history) => [...history, `> Connected to: ${username}@${endpoint.host_ip}, platform: ${endpoint.platform}, session established at: ${sessionTime} \n`]);
          return;
        };

        if (command === "exit" || command === "logout") {
          setCommandHistory((history) => [...history, "> Exiting session and disconnecting endpoint! \n"]);
          await EndpointService.disconnectEndpoint(endpoint.host_id);
          setUsername("");
          setPassword("")
          setCommand("");
          setEndpoint(null);
          setSessionTime("");
          setCommandHistory([]);
          return;
        };

       

        setCommandHistory((history) => [...history, `> ${command}`]);
        setCommand("");

       
        const response = await EndpointService.sendCommand(endpoint.host_id, command);
        setCommandHistory((history) => [...history, `${response.result.execution_result}`]);
        setCommandHistory((history) => [...history, "> \n"]);
    };
  };

  const handleEndpointChange = async (option) => {
    setEndpoint(option);
  };

  useEffect(() => {
    const fetchEndpoints = async () => {
      let endpointData = [];
      const response = await EndpointService.fetchEndpoints();
      if (response.result.error) {
        return;
      };
      response.result.forEach(host => {
        endpointData.push({ label: host.host_name, host_ip: host.host_ip, host_id: host.host_uuid, platform: host.host_os });
      });
      setEndpoints(endpointData);
    };
    fetchEndpoints();
  }, []);

  return <div id="rtc-wrapper">
    <Navbar/>
    <div className="select__div">
      <IconButton onClick={onShowInformationPopup} sx={{ marginBottom: 0.1}}><InfoIcon sx={{ color: "white"}}/></IconButton>
      <Select id="select" placeholder="Select Endpoint for SSH Connection" value={endpoint} options={endpoints} onChange={handleEndpointChange}/>
      <form className="ssh-login__form">
        <input id="username"  placeholder="Enter Username" required type="text" value={username} onChange={({ target }) => setUsername(target.value)}/>
        <input id="password" placeholder="Enter Password" required type="password" value={password} onChange={({ target }) => setPassword(target.value)}/>
        <input id="connect-btn" type="submit" value="Connect to Endpoint" onClick={onConnectToEndpoint}/>
      </form>
    </div>
    <div id="terminal">
      <pre>{commandHistory.join("\n")}</pre>
    </div>
    <textarea id="command-input" value={command} placeholder="Enter your command here" onChange={handleCommandInputChange} onKeyDown={handleCommandKeyEvent}></textarea>
  <Dialog open={showInformationPopup} onClose={onCloseShowInformationPopup} fullWidth maxWidth="sm">
    <DialogTitle>Endpoint Real Time Console (RTC) Page Guide</DialogTitle>
    <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
       <p style={{ marginTop: -3, marginBottom: 0 }}>Hello World</p>
    </DialogContent>
    <DialogActions>
      <Button onClick={onCloseShowInformationPopup}color="primary">Close</Button>
    </DialogActions>
  </Dialog>
  </div>
}


export default EndpointRTC;