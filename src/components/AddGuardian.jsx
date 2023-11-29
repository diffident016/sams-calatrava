import React, { useEffect, useState } from 'react'
import { PersonAdd, Close } from '@mui/icons-material'
import ShowDialog from './ShowDialog'
import { Guardian } from '../models/Guardian'
import { addGuardian, editGuardianInfo } from '../api/Service'

function AddGuardian({ show, close, setAlert, setShowAlert, type, editGuardian, setEditGuardian }) {

    const [showDialog, setShowDialog] = useState(false)
    const { guardian, updateGuardian } = Guardian();
    const [update, setUpdate] = useState(false);

    useEffect(() => {
        if (!editGuardian) return

        setUpdate(true);
        updateGuardian({
            firstname: editGuardian.firstname,
            mi: editGuardian.mi,
            lastname: editGuardian.lastname,
            phone: editGuardian.phone,
            dateAdded: editGuardian.dateAdded,
        })
    }, [editGuardian])

    const handleSubmit = (e) => {
        e.preventDefault()
        setShowDialog(true)
    }

    const dialogCallback = async (selection) => {
        if (!selection) return

        try {

            if (update) {
                await editGuardianInfo(editGuardian.docId, guardian)
            } else {
                await addGuardian(guardian)
            }

            setAlert({
                type: type.SUCCESS,
                message: !update ?
                    'Guardian has been added to the record successfully.'
                    : 'Guardian info updated successfully.',
                duration: 4000
            })
            setShowAlert(true)
            clearForm()

        } catch (e) {

            console.log(e)
            setAlert({
                type: type.ERROR,
                message: !update ? 'Failed to add student to the record.' : 'Failed to update student info.',
                duration: 4000
            })
            setShowAlert(true)
        }

    }

    const clearForm = () => {
        updateGuardian({
            firstname: '',
            mi: '',
            lastname: '',
            phone: '',
        })

        setEditGuardian(null)
        setUpdate(false)
        close(false)
    }

    return (
        <>
            {show && (<div className='z-20 absolute h-full w-full bg-[#f5f7f8]/80'>
                <div className='w-full h-full flex items-center justify-center'>
                    <div className='flex flex-col p-6 w-[450px] h-[450px] bg-white border shadow-sm rounded-lg text-[#607d8b] font-roboto'>
                        <div className='flex flex-row justify-between'>
                            <PersonAdd color='inherit' />
                            <Close onClick={() => {
                                clearForm()
                            }} className='cursor-pointer' />
                        </div>
                        <h1 className='pt-4 pb-2 font-roboto-bold'>{!update ? 'Add new Guardian' : 'Update Guardian'}</h1>
                        <p className='text-sm'>Please fill the information below.</p>
                        <form onSubmit={handleSubmit} className='flex flex-col py-5 w-full gap-2'>
                            <div className='flex flex-row w-full gap-2'>
                                <div className='flex-1'>
                                    <label className='py-1 text-xs font-roboto-bold'>First Name <span className='text-[#dc2626]'>*</span></label>
                                    <input
                                        value={guardian.firstname}
                                        required
                                        onChange={(e) => {
                                            updateGuardian({ firstname: e.target.value })
                                        }}
                                        type='text'
                                        className='w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2' />
                                </div>
                                <div className='w-1/3'>
                                    <label className='py-1 text-xs font-roboto-bold'>M.I. <span className='text-[#dc2626]'>*</span></label>
                                    <input
                                        required
                                        value={guardian.mi}
                                        onChange={(e) => {
                                            updateGuardian({ mi: e.target.value })
                                        }}
                                        type='text'
                                        className='w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2' />
                                </div>
                            </div>
                            <div className='flex-1'>
                                <label className='py-1 text-xs font-roboto-bold'>Last Name <span className='text-[#dc2626]'>*</span></label>
                                <input
                                    required
                                    value={guardian.lastname}
                                    onChange={(e) => {
                                        updateGuardian({ lastname: e.target.value })
                                    }}
                                    type='text'
                                    className='w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2' />
                            </div>
                            <div className='flex-1'>
                                <label className='py-1 text-xs font-roboto-bold'>Phone Number <span className='text-[#dc2626]'>*</span></label>
                                <input
                                    required
                                    value={guardian.phone}
                                    onChange={(e) => {
                                        updateGuardian({ phone: e.target.value })
                                    }}
                                    type='text'
                                    className='w-full text-sm h-9 border border-[#cecece]  rounded-md focus:outline-none px-2' />
                            </div>

                            <div className='flex flex-row w-full py-6 justify-end text-white text-sm font-roboto-bold gap-2'>
                                <button type='submit' className='w-20 h-8 bg-[#49a54d] rounded-md'>{!update ? 'Add' : 'Update'}</button>
                                <button onClick={() => {
                                    clearForm()
                                }} type='reset' className='w-20 h-8 text-[#607d8b] rounded-sm'>Cancel</button>
                            </div>
                            <ShowDialog
                                title={!update ? 'Add Guardian' : 'Update Guardian'}
                                description={`Are you sure you want to ${!update ? 'add' : 'update'} guardian?`}
                                open={showDialog}
                                close={setShowDialog}
                                callback={dialogCallback} />
                        </form>
                    </div>
                </div>
            </div>)}
        </>
    )
}

export default AddGuardian