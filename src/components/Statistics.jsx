import React from 'react'
import LinearProgress from '@mui/material/LinearProgress';

function Statistics() {
    return (
        <div className='flex-1 h-80 border shadow-sm bg-white rounded-xl'>
            <div className='font-roboto text-[#607d8b] flex flex-col p-5 gap-2'>
                <h1 className='font-roboto-bold text-lg'>Statistics</h1>
                <div className='flex flex-col gap-1 p-2 border rounded-lg shadow-sm'>
                    <div className='flex justify-between'>
                        <label className='text-xs font-roboto-bold'>Today</label>
                        <label className='text-xs font-roboto'>12/100 students</label>
                    </div>
                    <LinearProgress className='rounded-sm text-[#49a54d]' variant='determinate' value={12} color='inherit' />
                </div>
                <div className='flex flex-col gap-1 p-2 border rounded-lg shadow-sm'>
                    <div className='flex justify-between'>
                        <label className='text-xs font-roboto-bold'>Yesterday</label>
                        <label className='text-xs font-roboto'>56/100 students</label>
                    </div>
                    <LinearProgress className='rounded-sm text-[#49a54d]' variant='determinate' value={56} color='inherit' />
                </div>
                <div className='flex flex-col gap-1 p-2 border rounded-lg shadow-sm'>
                    <div className='flex justify-between'>
                        <label className='text-xs font-roboto-bold'>Thu, Nov 23, 2023</label>
                        <label className='text-xs font-roboto'>80/100 students</label>
                    </div>
                    <LinearProgress className='rounded-sm text-[#49a54d]' variant='determinate' value={80} color='inherit' />
                </div>

            </div>
        </div>
    )
}

export default Statistics