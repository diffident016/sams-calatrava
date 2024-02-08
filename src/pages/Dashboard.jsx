import React, { useEffect, useState } from 'react'
import Today from '../components/Today'
import Statistics from '../components/Statistics'
import TodayActivity from '../components/TodayActivity'
import AdminTable from '../components/AdminTable'
import Demographics from '../components/Demographics'
import { format } from 'date-fns'

function Dashboard({ students, records, studentFetch, recordFetch, rawRecords }) {

    const [filteredRecords, setFilteredRecords] = useState([]);

    useEffect(() => {   
        if(students.length < 1) return;

        let temp = students.map((item) => {
            return item.studentId;
        });

        temp = rawRecords.filter((r) => temp.includes(r.student.studentId));

        const group = temp.reduce((group, record) => {
            const { dateRecord } = record;
            group[format(dateRecord.toDate(), 'yyyy/MM/dd')] = group[format(dateRecord.toDate(), 'yyyy/MM/dd')] ?? [];
            group[format(dateRecord.toDate(), 'yyyy/MM/dd')].push(record);
            return group;
        }, {});

        setFilteredRecords(group);

    }, [students, rawRecords]);

    return (
        <div className='w-full h-full overflow-auto'>
            <div className='flex flex-col h-full gap-5'>
                <div className='h-full flex flex-row gap-5'>
                    <Today />
                    <Statistics
                        recordFetch={recordFetch}
                        studentFetch={studentFetch}
                        records={filteredRecords}
                        students={students} 
                        />
                    <TodayActivity
                        recordFetch={recordFetch}
                        records={records} />
                </div>
                <Demographics
                    recordFetch={recordFetch}
                    studentFetch={studentFetch}
                    records={filteredRecords}
                    students={students}
                />
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