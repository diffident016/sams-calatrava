import React from 'react'
import { CircleOutlined, AccessTime, Upcoming, Error } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { format } from 'date-fns'

function TodayActivity({ recordFetch, records }) {

    const StateBuilder = (state) => {

        const states = {
            "2": {
                icon: <Upcoming />,
                text: 'No entries'
            },
            "-1": {
                icon: <Error />,
                text: 'Something went wrong.'
            },
            "0": {
                icon: <CircularProgress className='text-[#49a54d]' color='inherit' />,
                text: 'Loading entries...'
            }
        }

        return (
            <div className='flex flex-col h-full justify-center items-center gap-4 text-white'>
                {states[`${state}`].icon}
                <p className='text-sm'>{states[`${state}`].text}</p>
            </div>
        )
    }

    return (
        <div className='font-roboto text-[#607d8b] flex-1 h-80 border shadow-sm bg-white rounded-xl'>
            <div className='h-full font-roboto text-[#607d8b] flex flex-col p-5 gap-2'>
                <h1 className='font-roboto-bold text-lg'>Today's Activity</h1>
                {
                    recordFetch != 1 ? StateBuilder(recordFetch) :
                        <>
                            {
                                <div className='p-2 h-full overflow-y-auto'>
                                    {
                                        !records[format(new Date(), 'yyyy/MM/dd')] ?
                                            (<div className='h-full flex items-center justify-center'>
                                                <p className='text-sm'>No activities yet.</p>
                                            </div>) :
                                            records[format(new Date(), 'yyyy/MM/dd')].map((record, i) => {
                                                return (
                                                    <div className='flex flex-row w-full h-12 items-center gap-x-4'>
                                                        <div className='flex flex-col items-center text-[#49a54d] text-sm h-full'>
                                                            {i == 0 ?
                                                                <CircleOutlined className='animate-pulse' color='inherit' fontSize='inherit' />
                                                                : <CircleOutlined color='inherit' fontSize='inherit' />}
                                                            {i != (records[format(new Date(), 'yyyy/MM/dd')].length) - 1 && <div className='my-[2px] w-[2px] h-full bg-[#49a54d]/50'></div>}
                                                        </div>
                                                        <div className='flex flex-col h-full mt-[-6px]'>
                                                            <h1 className='font-roboto-bold text-sm'>{record.name}</h1>
                                                            <label className='flex items-center text-xs gap-1'>
                                                                <AccessTime fontSize='inherit' />
                                                                <span> {format(record.dateRecord.toDate(), 'hh:mm a')}</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                )
                                            })
                                    }
                                </div>
                            }
                        </>
                }
            </div>
        </div>
    )
}

export default TodayActivity