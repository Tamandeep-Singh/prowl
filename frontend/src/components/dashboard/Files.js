import { DataGrid } from "@mui/x-data-grid";
import FileService from "../../services/file_service";
import { useEffect, useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import "./css/base.css"

const Files = () => {
    const [rows, setRows] = useState([]);
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });

    const columns = [
        {field: "host_name", headerName: "Host Name", width: 130},
        {field: "file_name", headerName: "File Name", width: 150},
        {field: "file_path", headerName: "File Path", renderCell: (params) => (
            <Tooltip title={params.value}>
              <span style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                width: '100%',
              }}>
                {params.value}
              </span>
            </Tooltip>
        )},
        {field: "hash", headerName: "File Hash (SHA-1)", renderCell: (params) => (
            <Tooltip title={params.value}>
              <span style={{
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
                width: '100%',
              }}> {params.value}
             </span>
            </Tooltip>
          )},
        {field: "file_creation", headerName: "Created At"},
        {field: "file_modified", headerName: "Modified At"},
        {field: "file_size", headerName: "File Size (Bits)"},
        {field: "file_description", headerName: "File Summary"},

    ];

     useEffect(() => {
            const fetchFiles = async () => {
              const files = [];
              const response = await FileService.fetchFiles();
              if (response.result.error) {
                return;
              };
              response.result.map(file => {
                files.push({
                    id: file._id,
                    host_name: file.host_name || "null",
                    file_name: file.file_name,
                    file_path: file.file_path,
                    hash: file.sha1_hash,
                    file_creation: file.creation_ts,
                    file_modified: file.last_mod_ts,
                    file_size: file.file_size,
                    file_description: file.file_description
                });
              });
              setRows(files);
            };
            fetchFiles();
          }, []);

    return <div>
       <p id="title">Endpoint Files</p>
       <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[10]} />
    </div>
};

export default Files;