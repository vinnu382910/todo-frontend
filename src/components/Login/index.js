import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';
import './index.css'

const Signup = () => {

    const navigate = useNavigate()
    const [loginInfo, setLoginInfo] = useState({
        email: '',
        password: '',
    })

    const onChangeInputVal = (e) => {
        const {name, value} = e.target;
        const copyLoginInfo = {...loginInfo}
        copyLoginInfo[name] = value;
        setLoginInfo(copyLoginInfo)
    }
    console.log('LoginInfo => ', loginInfo);
    const handleLogin = async (e) => {
        e.preventDefault();
        const {email, password} = loginInfo;
        if (!email || !password) {
            handleError('email and password are required!')
        }
        try {
            const url = "https://todo-backend-5453.onrender.com/auth/login";
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(loginInfo)
            });
            const results = await response.json()
            const {message, success, jwtToken, name, error} = results
            if (success) {
                handleSuccess(message);
                localStorage.setItem('token', jwtToken)
                localStorage.setItem('loggedInUser', name)
                setTimeout(() => {
                    navigate('/home')
                }, 1000)
            }else if (error){
                const errMsg = error?.details[0].message;
                handleError(errMsg)
            }else if (!success){
                handleError(message)
            }
        } catch (err) {
            handleError(err)
        }
    }
    return (
        <div className='signup-container'>
            <div className='container'>
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <div>
                        <label htmlFor='email'>Email</label>
                        <input 
                            onChange={onChangeInputVal}
                            type='email'
                            name='email'
                            placeholder='Enter your email...'
                            value={loginInfo.email}
                        />
                    </div>
                    <div>
                        <label htmlFor='password'>Password</label>
                        <input
                            onChange={onChangeInputVal}
                            type='password'
                            name='password'
                            placeholder='Enter your password...'
                            value={loginInfo.password}
                        />
                    </div>
                    <button type='submit'>Login</button>
                    <p>Don't have an account ?
                        <span className='login'><Link to="/signup">Signup</Link></span>
                    </p>
                </form>
                <ToastContainer />
            </div>
        </div>
    )
}

export default Signup
