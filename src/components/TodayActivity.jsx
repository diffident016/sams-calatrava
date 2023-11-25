import React from 'react'
import { CircleOutlined, AccessTime } from '@mui/icons-material';

function TodayActivity() {
    return (
        <div className='font-roboto text-[#607d8b] flex-1 h-80 border shadow-sm bg-white rounded-xl'>
            <div className='h-full font-roboto text-[#607d8b] flex flex-col p-5 gap-2'>
                <h1 className='font-roboto-bold text-lg'>Today's Activity</h1>
                <div className='p-2 h-full overflow-y-auto'>
                    {
                        [1, 2, 3, 4, 5, 6, 7].map((i) => {
                            return (
                                <div className='flex flex-row w-full h-12 items-center gap-x-4'>
                                    <div className='flex flex-col items-center text-[#49a54d] text-sm h-full'>
                                        <CircleOutlined color='inherit' fontSize='inherit' />
                                        <div className='my-[2px] w-[2px] h-full bg-[#49a54d]/50'></div>
                                    </div>
                                    <div className='flex flex-col h-full mt-[-6px]'>
                                        <h1 className='font-roboto-bold text-sm'>Sample Student {i}</h1>
                                        <label className='flex items-center text-xs'>
                                            <AccessTime fontSize='inherit' />
                                            <span>10:30am</span>
                                        </label>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default TodayActivity