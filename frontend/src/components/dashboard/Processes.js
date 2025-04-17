import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import "./css/Processes.css"

const Processes = () => {
    const [processes, setProcesses] = useState([]);
    const [rows, setRows] = useState([]);
    const columns = [
        
    ];

    useEffect(() => {
      }, []);

    return <div>
       <p id="title">Processes</p>
       <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight />
    </div>
};

export default Processes;