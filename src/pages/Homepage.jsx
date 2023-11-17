import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

function Homepage() {
    return (
        <>
            <div className='w-full h-screen p-4 font-roboto'>
                <div className='flex flex-row w-full h-full gap-x-4'>
                    <Sidebar />
                    <div className='w-full'>
                        <Navbar />
                    </div>
                </div>
            </div>

        </>
    )
}

export default Homepage