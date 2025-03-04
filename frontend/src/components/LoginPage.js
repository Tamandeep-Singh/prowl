import { useState } from "react";
import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from "react-router-dom";

const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const onUserLogin = async (event) => {
        event.preventDefault();
        console.log(email)
        console.log(password)

    }

    return <div>
       <p>Login</p>
       <form>
        <label>Enter Email:<input type="email" value={email} onChange={({ target }) => setEmail(target.value)}/></label>
        <label>Enter Password:<input type="password" value={password} onChange={({ target }) => setPassword(target.value)}/></label>
        <button onClick={onUserLogin}>Submit</button>
       </form>
    </div>
};

export default LoginPage;