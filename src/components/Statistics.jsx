import React, { useEffect, useState } from 'react'
import { Upcoming, Error } from '@mui/icons-material';
import { CircularProgress, LinearProgress } from '@mui/material';
import { format, isToday, isYesterday, parse } from 'date-fns'

function Statistics({ students, records, studentFetch, recordFetch, rawRecords }) {

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

    const StateBuilder = (state) => {

        const states = {
            "2": {
                icon: <Upcoming />,
                text: 'No statistics'
            },
            "-1": {
                icon: <Error />,
                text: 'Something went wrong.'
            },
            "0": {
                icon: <CircularProgress className='text-[#49a54d]' color='inherit' />,
                text: 'Loading statistics...'
            }
        }

        return (
            <div className='flex flex-col h-full justify-center items-center gap-4 text-[#607d8b]'>
                {/* {states[`${state}`].icon} */}
                <p className='text-sm'>{states[`${state}`].text}</p>
            </div>
        )
    }

    const formatDate = (date) => {

        if (isToday(parse(date, 'yyyy/MM/dd', new Date()))) {
            return 'Today'
        } else if (isYesterday(parse(date, 'yyyy/MM/dd', new Date()))) {
            return 'Yesterday'
        }

        return format(parse(date, 'yyyy/MM/dd', new Date()), 'eeee - MMM dd, yyyy')
    }

    return (
        <div className='flex-1 h-80 border shadow-sm bg-white rounded-xl'>
            <div className='font-roboto text-[#607d8b] flex flex-col p-5 h-full'>
                <h1 className='font-roboto-bold text-lg'>Statistics</h1>
                <div className='flex flex-col gap-2 overflow-auto py-2 h-full'>
                    {
                        (recordFetch != 1) ? StateBuilder(recordFetch) :
                            <>
                                {
                                    Object.keys(filteredRecords).map((r) => {
                                        const studentCount = students.length;

                                        if (studentCount < 1) return

                                        const groupRecords = filteredRecords[r].reduce((group, record) => {
                                            const { studentId } = record.student;
                                            group[studentId] = group[studentId] ?? [];
                                            group[studentId].push(record);
                                            return group;
                                        }, {});
                                        
                                        const recordCount = Object.keys(groupRecords).length

                                        return (
                                            <div className='flex flex-col gap-1 p-2 border rounded-lg shadow-sm'>
                                                <div className='flex justify-between'>
                                                    <label className='text-xs font-roboto-bold'>{
                                                        formatDate(r)}
                                                    </label>
                                                    <label className='text-xs font-roboto'>{recordCount}/{studentCount} students</label>
                                                </div>
                                                <LinearProgress className='rounded-sm text-[#49a54d]' variant='determinate' value={(recordCount / studentCount) * 100} color='inherit' />
                                            </div>
                                        )
                                    })
                                }
                            </>
                    }
                </div>

            </div>
        </div>
    )
}

export default Statistics