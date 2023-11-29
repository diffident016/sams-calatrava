import React from 'react'
import Today from '../components/Today'
import Statistics from '../components/Statistics'
import TodayActivity from '../components/TodayActivity'
import AdminTable from '../components/AdminTable'

function Dashboard({ students, records, studentFetch, recordFetch }) {
    return (
        <div className='w-full h-full overflow-auto'>
            <div className='flex flex-col h-full gap-5'>
                <div className='h-full flex flex-row gap-5'>
                    <Today />
                    <Statistics
                        recordFetch={recordFetch}
                        studentFetch={studentFetch}
                        records={records}
                        students={students} />
                    <TodayActivity
                        recordFetch={recordFetch}
                        records={records} />
                </div>
                <div className='w-full h-full flex flex-row gap-5'>
                    <AdminTable
                        fetchState={recordFetch}
                        records={records} />
                </div>
            </div>
        </div>
    )
}

export default Dashboard