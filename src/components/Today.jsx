import React, { useState, useEffect } from 'react'
import { format } from 'date-fns';

function Today() {

    const date = new Date();
    const [ctime, setTime] = useState(new Date().toLocaleTimeString())

    useEffect(() => {

        const timer = setInterval(() => {
            setTime(new Date().toLocaleTimeString())
        }, 1)

        return () => {
            clearInterval(timer)
        }
    }, [ctime]);

    return (
        <div className='font-roboto flex-1 h-80 border text-[#607d8b] shadow-sm bg-white rounded-xl'>
            <div className='flex flex-col h-full items-center justify-center gap-6'>
                <h1 className='font-roboto-bold text-xl text-[]'>Today is</h1>
                <div className='text-center'>
                    <h1 className='font-roboto-bold text-2xl'>{format(date, 'eeee')}</h1>
                    <h1 className='font-roboto-bold text-2xl'>{format(date, 'MMM dd, yyyy')}</h1>
                </div>
                <p className='font-roboto text-lg'>{ctime}</p>
            </div>
        </div>
    )
}

export default Today