import Today from '../components/Today'
import React from 'react'
import Statistics from '../components/Statistics'
import TodayActivity from '../components/TodayActivity'
import AdminTable from '../components/AdminTable'

function AdminDashboard() {
    return (
        <div className='w-full h-[500px] overflow-auto'>
            <div className='relative flex flex-col h-full py-5 gap-5'>
                <div className='h-full flex flex-row gap-5'>
                    <Today />
                    <Statistics />
                    <TodayActivity />
                </div>
                <div className='h-full flex flex-row gap-5'>
                    <AdminTable />
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard