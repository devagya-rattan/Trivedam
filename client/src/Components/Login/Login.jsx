import React, { useState } from 'react'
import "./Login.css"
import loginIntro from "../../assets/Images/Login_intro.png"
import axios from "axios"
import { useNavigate } from 'react-router-dom'
const Login = () => {
    const BASE_URL = 'http://localhost:3050';
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const loginUser = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(`${BASE_URL}/api/login`, { email, password })
            const token = response.data.token;
            localStorage.setItem("token", token);
            navigate("/dashboard/uuid")

        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div className='Login-main'>
            <div className="Login-image">
                <img src={loginIntro} alt="Login" />
            </div>
            <div className="Login-form">
                <form onSubmit={loginUser}>
                    <h1>Login</h1>
                    <input type="email" value={email} placeholder='Email' onChange={((e) => setEmail(e.target.value))} />
                    <input type="password" placeholder='Password' value={password} onChange={((e) => setPassword(e.target.value))} />
                    <button type="submit" >Login</button>
                    <p>Don't have an account? <span>Please ask the Supervisor to create account through IOT Device.</span></p>
                </form>

            </div>
        </div>
    )
}

export default Login