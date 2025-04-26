import "../../css/base.css";
import { DataGrid } from "@mui/x-data-grid";
import ProwlUsersService from "../../services/prowl_users_service";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ErrorIcon from "@mui/icons-material/Error";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Snackbar, Alert, IconButton} from "@mui/material";
import InfoIcon from "@mui/icons-material/Info";

const ProwlUsers = () => {
    const [rows, setRows] = useState([]);
    const [error, setError] = useState("");
    const [showPopup, setShowPopup] = useState(false);
    const [updateUser, setUpdateUser] = useState({});
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [showInformationPopup, setShowInformationPopup] = useState(false);
    const [editError, setEditError] = useState(false);
    const [refetch, setRefetch] = useState(false);
    const navigate = useNavigate();
    const [paginationModel, setPaginationModel] = useState({
        pageSize: 5,
        page: 0,
    });


    const onShowInformationPopup = () => {
      setShowInformationPopup(true);
    };

    const onCloseShowInformationPopup = () => {
      setShowInformationPopup(false);
    };


    const onUserEditPopupClick = (user) => {
        setShowPopup(true);
        setUpdateUser(user);
    };

    const onUserEditPopupClose = () => {
        setShowPopup(false);
        setUpdateUser({});
    };

    const onUserAttributeChange = (event) => {
        const { name, value } = event.target;
        setUpdateUser({...updateUser, [name]: value});
    };

    const onUpdateUserClick = async () => {
        const response = await ProwlUsersService.updateProwlUser(updateUser);
        if (response.result.error) { setEditError(true); }
        setShowPopup(false);
        setUpdateUser({});
        setShowSnackbar(true);
        setRefetch(true);
    };

    const onCloseSnackbarClick = () => {
        setShowSnackbar(false);
        setEditError(false);
    };

    const columns = [
        {field: "user_id", headerName: "User ID", width: 220},
        {field: "username", headerName: "Username", width: 180},
        {field: "email", headerName: "Email", width: 260},
        {field: "role", headerName: "User Role", width: 120},
        {field: "date_added", headerName: "Added On", width: 180},
        {field: "date_updated", headerName: "Modified On", width: 180},
        {field: "edit_user", headerName: "Actions", width: 190, sortable: false, filterable: false, renderCell: (params) => (
            <Button variant="contained" size="small" onClick={() => onUserEditPopupClick(params.row)}>Edit User</Button>),
        }
    ];

    useEffect(() => {
        setRefetch(false);
        const fetchProwlUsers = async () => {
          const users = [];
          const response = await ProwlUsersService.fetchProwlUsers();
          if (response.result.error) {
            if (response.result.invalid) {
                window.localStorage.clear();
                return navigate("/login", {
                  state: {
                    externalError: "Invalid authentication details provided, please relogin."
                  }
                });
            };
            setError("Could not retrieve Prowl Users from the API");
            return;
          };
          response.result.forEach(user => {
            users.push({
                id: user._id,
                user_id: user._id,
                username: user.username,
                email: user.email,
                role: user.role, 
                date_added: new Date(user.createdAt).toLocaleString("en-GB"),
                date_updated: new Date(user.updatedAt).toLocaleString("en-GB")
            });
          });
          setRows(users);
        };
        fetchProwlUsers();
      }, [navigate, refetch]);

    return <div>
      <p id="title">Admin Panel: Prowl Users <IconButton onClick={onShowInformationPopup} sx={{ marginBottom: 0.1}}><InfoIcon sx={{ color: "white"}}/></IconButton></p>
      {error && <span id="api-error">{<ErrorIcon sx={{ color: "red", fontSize: 25, marginRight: 0.5 }} />} Error: {error}</span>}
      <DataGrid rows={rows} columns={columns} pageSize={5} autoHeight pagination paginationModel={paginationModel}
  onPaginationModelChange={setPaginationModel}
  pageSizeOptions={[5, 10]}/>
   <Dialog open={showPopup} onClose={() => setShowPopup(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <TextField margin="dense" label="Email" name="email" fullWidth onChange={onUserAttributeChange} value={updateUser?.email || ""}/>
          <TextField margin="dense" label="Role" name="role" fullWidth onChange={onUserAttributeChange} value={updateUser?.role || ""}/>
        </DialogContent>
        <DialogActions>
          <Button onClick={onUserEditPopupClose}>Close</Button>
          <Button onClick={onUpdateUserClick} variant="contained" color="primary">Update User</Button>
        </DialogActions>
    </Dialog>
    <Snackbar open={showSnackbar} autoHideDuration={1500} onClose={onCloseSnackbarClick} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
        {editError === false ?  <Alert severity="success" sx={{ width: "100%" }}>Changes were successfully made!</Alert> : <Alert severity="error" sx={{ width: "100%" }}>An error occured, changes were not made!</Alert>}
    </Snackbar>
    <Dialog open={showInformationPopup} onClose={onCloseShowInformationPopup} fullWidth maxWidth="sm">
      <DialogTitle>Prowl Users Page Guide</DialogTitle>
      <DialogContent sx={{ whiteSpace: "pre-wrap", wordBreak: "break-word", overflowX: "hidden", overflowY: "auto", maxHeight: "70vh"}}>
         <p style={{ marginTop: -3, marginBottom: 0 }}>Hello World</p>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseShowInformationPopup}color="primary">Close</Button>
      </DialogActions>
    </Dialog>
    </div>
};

export default ProwlUsers;