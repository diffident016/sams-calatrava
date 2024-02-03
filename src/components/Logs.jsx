import { ArrowBack, Print } from '@mui/icons-material'
import React, { useEffect, useState, forwardRef } from 'react'
import { getRecordsByDay, getRecordsById, onSnapshot } from '../api/Service';
import { format } from 'date-fns';

export const Logs = forwardRef(({ close, studentId, print, all = false }, ref) => {

    const [fetchState, setFetchState] = useState(0);
    const [records, setRecords] = useState([]);

    useEffect(() => {
        let query = all ? getRecordsByDay() : getRecordsById(studentId);

        try {
            const unsub = onSnapshot(query, (snapshot) => {

                if (!snapshot) {
                    setFetchState(-1);
                    return;
                }

                if (snapshot.empty) {
                    setFetchState(2);
                    return;
                }

                const data = snapshot.docs.map((doc) => doc.data());
                setFetchState(1);
                setRecords(data);
            });

            return () => {
                unsub();
            };
        } catch (err) {
            console.log(err);
        }
    }, []);

    const column = [
        { name: "Time", width: 200 },
        { name: "Name", width: 200 },
        { name: "Status", width: 200 }
    ]

    return (
        <div className='bg-white w-[700px] h-full overflow-auto text-[#607d8b]'>
            <div className='flex flex-row justify-between p-4'>
                <ArrowBack
                    onClick={() => {
                        close();
                    }}
                    className='cursor-pointer' />
                <div
                    onClick={() => {
                        print();
                    }}
                    className='text-sm flex flex-row gap-2 items-center border py-1 px-4 rounded-md cursor-pointer'>
                    <Print />
                    Print
                </div>

            </div>
            <div ref={ref} className='w-full flex flex-col items-center'>
                <h1 className='text-center text-lg font-bold'>Student Logs</h1>
                <div className='py-6 px-4 flex flex-row justify-between'>
                    {
                        column.map((v) => {
                            return (
                                <p className='text-sm font-bold' style={{ width: v.width }}>{v.name}</p>
                            );
                        })
                    }
                </div>
                <div className='flex flex-col'>
                    {
                        records.map((record) => {
                            return (
                                <div className='px-4 flex flex-row justify-between'>
                                    {
                                        [format(record['record'].dateRecord.toDate(), 'yyyy/MM/dd - p'),
                                        record['record'].student.firstname + ' ' + record['record'].student.lastname,
                                        record['record'].status == 0 ? 'INSIDE' : 'OUTSIDE'
                                        ].map((v) => {
                                            return (
                                                <p className='text-sm w-[200px]'>{v}</p>
                                            );
                                        })
                                    }
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
});
