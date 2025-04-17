import { DataGrid } from "@mui/x-data-grid";
import ProcessService from "../../services/process_service";
import { useEffect, useState } from "react";
import "./css/Processes.css"

const Processes = () => {
    const [rows, setRows] = useState([]);
    const columns = [
        
    ];

     useEffect(() => {
            const fetchProcesses = async () => {
              const processes = [];
              const response = await ProcessService.fetchProcesses();
              if (response.result.error) {
                return;
              };
              response.result.map(process => {
                processes.push({
                });
              });
              setRows(processes);
            };
            fetchProcesses();
          }, []);

    return <div>
       <p id="title">Processes</p>
       <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight />
    </div>
};

export default Processes;