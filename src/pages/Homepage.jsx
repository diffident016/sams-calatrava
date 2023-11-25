import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import AdminDashboard from './AdminDashboard'

function Homepage() {
    return (
        <>
            <div className='w-full h-screen p-4 font-roboto'>
                <div className='flex flex-row w-full h-full gap-x-6 overflow-hidden'>
                    <Sidebar />
                    <div className='w-full h-full'>
                        <Navbar />
                        <AdminDashboard />
                    </div>
                </div>
            </div>

        </>
    )
}

export default Homepage