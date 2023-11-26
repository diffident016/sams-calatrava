import React from 'react'
import { Inbox } from '@mui/icons-material'

function EmptyTable({ setAddStudent }) {

    const handleClick = () => {
        setAddStudent(true)
    }
    return (
        <div className='font-roboto w-full h-96 flex items-center justify-center text-[#607d8b] text-[45px]'>
            <div className='flex flex-col items-center justify-center'>
                <Inbox color='inherit' fontSize='inherit' className='' />
                <h1 className='text-base py-5'>The are no students on the record.</h1>
                <button onClick={handleClick} className='h-9 w-24 text-sm bg-[#49a54d] rounded-md text-white'>
                    Add Student
                </button>
            </div>

        </div>
    )
}

export default EmptyTable