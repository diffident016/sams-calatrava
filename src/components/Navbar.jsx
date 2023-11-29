import React from 'react'
import {
    QrCodeRounded,
    AccountCircle,
    PersonAdd
} from '@mui/icons-material';

function Navbar({ userType, screen, screens, setScreen }) {
    return (
        <div className='w-full h-20 border bg-white rounded-xl shadow-sm'>
            <div className='relative flex flex-row w-full h-full items-center text-[#607d8b]'>
                <div className='relative flex flex-col px-5'>
                    <h1 className='text-sm '>{screens.header}</h1>
                    <h1 className='text-md font-bold'>{screens.header.split(' / ')[1]}</h1>
                </div>
                {screen < 1 && <div onClick={() => { setScreen(userType === 1 ? 2 : 1) }} className='flex-1 flex flex-row text-[#607d8b] gap-2 items-center mx-4 cursor-pointer'>
                    {userType === 1 ? <QrCodeRounded color='inherit' /> : <PersonAdd color='inherit' />}
                    <h1 className='text-sm font-roboto-bold'>{userType === 1 ? 'Scan QR Code' : 'Add Student'}</h1>
                </div>}
                <div className='absolute right-0 flex flex-row px-10 text-[#607d8b] gap-4 items-center '>
                    <div className='flex flex-row items-center gap-2'>
                        <AccountCircle />
                        <h1 className='text-sm font-bold'>{userType === 1 ? 'Administrator' : 'Registrar'}</h1>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar