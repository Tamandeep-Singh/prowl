import { Card, CardContent, Typography, Divider, Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Snackbar, Alert} from "@mui/material";
import AppUtils from "../../utils";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ProwlUsersService from "../../services/prowl_users_service";

const Account = () => {
    const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
    const [updateUser, setUpdateUser] = useState({});
    const [showSnackbar, setShowSnackbar] = useState(false);
    const [showMatchSnackbar, setShowMatchSnackbar] = useState(false);
    const [editError, setEditError] = useState(false);
    const payload = AppUtils.getTokenPayload();
    const navigate = useNavigate();

    const onCloseSnackbarClick = () => {
        setShowSnackbar(false);
        setEditError(false);
        setShowMatchSnackbar(false);
    };

    const onChangePasswordClick = async () => {
        if (updateUser.new_password === updateUser.confirm_new_password) {
            const response = await ProwlUsersService.changeUserPassword({
                userId: payload.uid,
                newPassword: updateUser.new_password
            });
            if (!response.result.success) {
                setEditError(true);
            };
            setShowChangePasswordPopup(false);
            setUpdateUser({});
            setShowSnackbar(true);
            return;
        };
        setShowChangePasswordPopup(false);
        setUpdateUser({});
        setShowMatchSnackbar(true);
    };

    const onUserAttributeChange = (event) => {
        const { name, value } = event.target;
        setUpdateUser({...updateUser, [name]: value});
    };

    const renderAccountMenu = () => {
        return <div style={{ width: "80vw", display:"flex", justifyContent: "center"}}>
            <Card sx = {{ marginTop: 5, height: 400, width: 600, paddingLeft: 2, paddingRight: 2}}>
            <CardContent>
                <Typography variant="h5" sx= {{ marginBottom: 1 }}>Account Management</Typography>
                <Divider sx= {{ marginTop: 1, marginBottom: 2}}/>
                <Typography sx={{ marginBottom: 2 }}><strong>User ID:</strong> {payload.uid}</Typography>
                <Typography sx={{ marginBottom: 2 }}><strong>Username:</strong> {payload.username}</Typography>
                <Typography sx={{ marginBottom: 2 }}><strong>Email:</strong> {payload.email}</Typography>
                <Typography sx={{ marginBottom: 2 }}><strong>Role:</strong> {payload.role}</Typography>
                <Divider sx= {{ marginTop: 1, marginBottom: 2}}/>
                <Typography sx={{ marginBottom: 2, textAlign: "center", fontSize: 20}}>Actions</Typography>
                <Button sx = {{display: "block", marginX: "auto" }} onClick={() => setShowChangePasswordPopup(true)} variant="contained" color="primary">Change Password</Button>
                </CardContent>
             </Card>
             <Dialog open={showChangePasswordPopup} onClose={() => setShowChangePasswordPopup(false)}>
                <DialogTitle>Edit Account Details</DialogTitle>
                <DialogContent>
                    <TextField type="password" margin="dense" label="New Password" name="new_password" fullWidth onChange={onUserAttributeChange} value={updateUser?.new_password || ""}/>
                    <TextField type="password" margin="dense" label="Confirm New Password" name="confirm_new_password" onChange={onUserAttributeChange} fullWidth value={updateUser?.confirm_new_password || ""}/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setShowChangePasswordPopup(false)}>Close</Button>
                    <Button onClick={onChangePasswordClick} variant="contained" color="primary">Change Password</Button>
                </DialogActions>
            </Dialog>
            <Snackbar open={showSnackbar} autoHideDuration={2000} onClose={onCloseSnackbarClick} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                    {editError === false ?  <Alert severity="success" sx={{ width: "100%" }}>Your password was successfully changed!</Alert> : <Alert severity="error" sx={{ width: "100%" }}>An error occured, please ensure your password contains a minimum of 8 characters!</Alert>}
            </Snackbar>
            <Snackbar open={showMatchSnackbar} autoHideDuration={2000} onClose={onCloseSnackbarClick} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
                <Alert severity="error" sx={{ width: "100%" }}>Both entered passwords should not be empty and must match!</Alert>
            </Snackbar>
        </div> 
    };

    const returnToLogin = () => {
        window.localStorage.clear();
        return navigate("/login");
    };

    return <>{payload ? renderAccountMenu() : returnToLogin()}</>
};

export default Account;