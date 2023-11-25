import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import logo from '../assets/images/logo.png'
import { useAuth } from '../auth/AuthContext'

function Login() {

    const [error, setError] = useState();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()

        setError('');

        try {
            await login(email, password);
            navigate('/')
        } catch (e) {
            console.log(e)
            setError('Invalid email or password.')
        }

    }

    return (
        <div className='font-roboto-bold text-[#323232] w-full h-screen flex flex-row'>
            <div className='flex-1 h-full flex flex-col items-center gap-4 py-28'>
                <img src={logo} className='w-48 h-48' />
                <h1 className='w-[60%] text-center font-bold text-3xl'>Calatrava SHS QR Code Student Monitoring System</h1>
            </div>
            <div className='w-[45%] h-full flex flex-row '>
                <div className='flex flex-col items-center pt-24'>
                    <h1 className='font-bold text-3xl text-[#1F2F3D]'>Log In</h1>
                    <p className='font-roboto text-lg py-4'>Enter your email and password to Log In.</p>
                    <div className='z-10 flex flex-col w-[500px] items-center'>
                        <form onSubmit={handleSubmit} className='flex flex-col z-10 w-[350px] py-4 font-arimo text-[#1F2F3D]'>
                            <label className='py-2 text-sm font-bold'>Email Address</label>
                            <input type='text' value={email} className='px-2 border font-roboto text-[#1F2F3D] border-[#1F2F3D] h-10 rounded-lg' name='username'
                                pattern="([A-Za-z0-9][._]?)+[A-Za-z0-9]@[A-Za-z0-9]+(\.?[A-Za-z0-9]){2}\.(com?|net|org)+(\.[A-Za-z0-9]{2,4})?"
                                title='Please enter a valid email'
                                required={true}
                                onChange={(e) => {
                                    setEmail(e.target.value.trim())
                                }} />
                            <label className='mt-3 py-2 text-sm font-bold'>Password</label>
                            <input type='password' value={password} className='px-2 border text-[#1F2F3D] border-[#1F2F3D] h-10 rounded-lg' name='username'
                                required={true}
                                onChange={(e) => {
                                    setPassword(e.target.value)
                                }} />
                            <button type='submit' className='mt-8 flex w-full h-10 bg-[#49a54d] rounded-lg justify-center items-center'>
                                <p className='text-white text-sm font-bold'>Log In</p>
                            </button>
                            <p className={`${error ? 'opacity-100' : 'opacity-0'} p-2 h-4 text-xs font-bold text-[#E8090C]`}>{error}</p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login