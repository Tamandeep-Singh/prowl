import axios from "axios";
const endpoint = "http://localhost:3000/api/v1/users/login"

const performUserLogin = async (email, password) => {
    const response = await axios.post(endpoint, { email, password });
    return response.data;
}

export default performUserLogin;