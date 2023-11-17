import React from 'react'
import {
    QrCodeRounded,
    AccountCircle,
    Notifications
} from '@mui/icons-material';

function Navbar() {
    return (
        <div className='w-full h-20 border bg-white rounded-xl shadow-sm'>
            <div className='flex flex-row w-full h-full items-center'>
                <div className='relative flex flex-col px-5'>
                    <h1 className='text-sm text-[#607d8b]'>Dashboard / <span className='text-[#323232]'>Home</span></h1>
                    <h1 className='text-md font-bold text-[#323232]'>Home</h1>
                </div>
                <div className='flex-1 flex flex-row text-[#607d8b] gap-2 items-center mx-4 cursor-pointer'>
                    <QrCodeRounded color='inherit' />
                    <h1 className='text-sm'>Scan QR Code</h1>
                </div>
                <div className='flex flex-row px-10 text-[#607d8b] gap-4 items-center'>
                    <div className='flex flex-row items-center gap-2'>
                        <AccountCircle />
                        <h1 className='text-sm font-bold'>Administrator</h1>
                    </div>
                    <Notifications />
                </div>
            </div>
        </div>
    )
}

export default Navbar