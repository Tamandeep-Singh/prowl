import { useEffect, useState } from "react";
import EndpointRTCService from "../services/endpoint_rtc_service";
import Navbar from "./Navbar";
import Select from 'react-select';
import "../css/EndpointRTC.css";

const EndpointRTC = () => {
  const [endpoints, setEndpoints] = useState([]);
  const [endpoint, setEndpoint] = useState(null);
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState([]);
 

  const handleCommandInputChange = async (event) => {
    setCommand(event.target.value);
  };

  const handleCommandKeyEvent = async (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
        if (command === "clear") {
          setCommand("");
          setCommandHistory([]);
          setCommandHistory((history) => [...history, `> Connected to ${endpoint.label}@${endpoint.host_ip} \n`])
          return;
        };

        if (command === "exit") {
          setCommand("");
          setEndpoint(null);
          setCommandHistory([]);
          return;
        };

        if (endpoint === null) {
          setCommandHistory((history) => [...history, "> Cannot issue command as the endpoint is not connected or invalid!\n"]);
          return;
        };

        setCommandHistory((history) => [...history, `> ${command}`]);
        setCommand("");

        const response = await EndpointRTCService.sendCommand(endpoint.host_uuid, command);
        setCommandHistory((history) => [...history, `${response.result.execution_result}`]);
        setCommandHistory((history) => [...history, "> \n"]);
    };
  };

  const handleEndpointChange = async (option) => {
    setEndpoint(option);
    const response = await EndpointRTCService.connectToEndpoint(option.host_uuid, option.host_ip, "tam","<ENTER PASSWORD HERE>");
    if (response.result.error) {
      setCommandHistory((history) => [...history, "> Unable to connect to the Endpoint, please check configuration settings!\n"]);
      return;
    };
    setCommandHistory((history) => [...history, `> Connected to ${option.label}@${option.host_ip} \n`])
  };

  useEffect(() => {
    const fetchEndpoints = async () => {
      let endpointData = [];
      const response = await EndpointRTCService.fetchEndpoints();
      if (response.result.error) {
        return;
      };
      response.result.forEach(host => {
        endpointData.push({ label: host.host_name, host_ip: host.host_ip, host_uuid: host.host_uuid });
      });
      setEndpoints(endpointData);
    };
    fetchEndpoints();
  }, []);

  return <div id="rtc-wrapper">
    <Navbar/>
    <div className="select__div">
      <Select id="select" placeholder="Select Endpoint for SSH Connection" value={endpoint} options={endpoints} onChange={handleEndpointChange}/>
    </div>
    <div id="terminal">
      <pre>{commandHistory.join("\n")}</pre>
    </div>
    <textarea id="command-input" value={command} placeholder="Enter your command here" onChange={handleCommandInputChange} onKeyDown={handleCommandKeyEvent}></textarea>
  </div>
}


export default EndpointRTC;