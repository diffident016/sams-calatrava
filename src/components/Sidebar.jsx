import React from 'react'
import logo from '../assets/images/logo.png'
import { useAuth } from "../auth/AuthContext";
import {
    Home,
    Person,
    Groups,
    SupervisorAccount,
    Logout
} from '@mui/icons-material';

function Sidebar({ userType, setScreen, screen }) {

    const { logout } = useAuth();

    const items = [
        { icon: <Home color='inherit' />, label: 'Dashboard' },
        { icon: <Person />, label: 'Students' },
        { icon: <Groups />, label: 'Check Attendance' },
        { icon: <SupervisorAccount />, label: 'Guardians' }
    ].filter((_, index) => {
        return index !== (userType === 1 ? 4 : 2);
    });

    const handleClick = (index) => {
        setScreen(index)
    }

    return (
        <div className='w-[26%] h-full rounded-2xl border border-[#cfd8dc] bg-white shadow-sm'>
            <div className='font-roboto-bold relative flex flex-col h-full items-center py-4'>
                <img className='w-32 h-32' src={logo} />
                <h1 className='font-bold py-3 text-lg text-[#607d8b]'>{userType === 1 ? 'Admin' : 'Registrar'} Dashboard</h1>
                <div className='grid grid-rows-4 w-full px-3 py-4 gap-1'>
                    {
                        items.map((item, i) => {
                            return (
                                <div key={item.label}
                                    onClick={() => { handleClick(i) }}
                                    className='w-full h-12 cursor-pointer'>
                                    <div className={`${i === screen ? 'text-white bg-[#49a54d]' : 'text-[#607d8b]'} h-full flex flex-row items-center px-6 gap-4 rounded-lg`}>
                                        {item.icon}
                                        <h1 className='font-semibold'>{item.label}</h1>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className='absolute bottom-2 w-full h-12 px-3 cursor-pointer'>
                    <div onClick={() => { logout() }} className='cursor-pointer flex flex-row text-[#607d8b] px-6 gap-4'>
                        <Logout color='inherit' />
                        <h1 className='font-bold'>Logout</h1>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Sidebar