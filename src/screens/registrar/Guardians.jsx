import React, { useState, useMemo } from 'react'
import DataTable from "react-data-table-component";
import EmptyTable from '../../components/EmptyTable';
import { deleteGuardian } from '../../api/Service';
import { PersonAdd, Edit, Delete } from '@mui/icons-material';
import { format } from 'date-fns'
import Loader from '../../components/Loader'
import ShowDialog from '../../components/ShowDialog';

function Guardians({
    setAddGuardian,
    setEditGuardian,
    setAlert,
    setShowAlert,
    type,
    guardians,
    fetchState
}) {

    const [showDialog, setShowDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState('');

    const handleDelete = async (docId) => {

        try {
            await deleteGuardian(docId)
            setAlert({
                type: type.SUCCESS,
                message: 'Guardian has been deleted successfully.',
                duration: 4000
            })
            setShowAlert(true)
        } catch (e) {
            setAlert({
                type: type.ERROR,
                message: 'Failed to delete the guardian.',
                duration: 4000
            })
            setShowAlert(true)
        }

    }

    const columns = useMemo(
        () => [
            {
                name: "No.",
                selector: (row) => row.no,
                width: '80px'
            },
            {
                name: "Name",
                selector: (row) => row.name,
                width: '250px'
            },
            {
                name: "Phone Number",
                selector: (row) => row.phone,
                width: '250px'
            },
            {
                name: "Date Added",
                selector: (row) => format(row.dateAdded.toDate(), 'LL/dd/yyyy'),
                width: '180px'
            },
            {
                name: "Actions",
                cell: function (row) {

                    let data = row.data
                    data['docId'] = row.docId

                    return (
                        <div className="flex flex-row w-[100px] h-full items-center text-[20px] gap-2">
                            <Edit
                                onClick={() => {
                                    setEditGuardian(data)
                                    setAddGuardian(true)
                                }}
                                className="cursor-pointer" fontSize="inherit" />
                            <div>|</div>
                            <Delete onClick={() => {
                                setSelectedRow(data.docId)
                                setShowDialog(true)
                            }} className="cursor-pointer" fontSize="inherit" />
                        </div>
                    )
                },
                width: '150px'
            },
        ]
    );

    return (
        <div className='w-full h-full bg-white border shadow-sm rounded-lg py-2 px-4'>
            <div className='font-roboto text-[#607d8b] flex flex-col p-4 gap-2 w-full'>
                <div className='flex flex-row justify-between py-2'>
                    <h1 className='font-roboto-bold text-lg'>Guardian Records</h1>
                    <div onClick={() => { setAddGuardian(true) }} className='flex flex-row gap-2 items-center mx-4 cursor-pointer'>
                        <PersonAdd color='inherit' />
                        <h1 className='text-sm font-roboto-bold'>Add Guardian</h1>
                    </div>
                </div>
                <DataTable
                    className="font-roboto rounded-md"
                    columns={columns}
                    data={guardians}
                    customStyles={
                        {
                            rows: {
                                style: {
                                    'color': '#607d8b',
                                    'font-family': 'Roboto',
                                    'font-size': '14px'
                                },
                            },
                            headCells: {
                                style: {
                                    'color': '#607d8b',
                                    'font-family': 'Roboto',
                                    'font-size': '14px',
                                    'font-weight': 'bold'
                                },
                            }
                        }
                    }
                    persistTableHead
                    progressPending={fetchState == 0 ? true : false}
                    progressComponent={<Loader />}
                    noDataComponent={
                        <EmptyTable
                            addEntry={setAddGuardian}
                            message={'The are no guardians on the record.'}
                            cta={'Add Guardian'} />}
                    fixedHeader
                    fixedHeaderScrollHeight="370px"
                    pagination
                />
            </div>
            <ShowDialog
                title={'Delete Guardian'}
                description={`Are you sure you want to delete this guardian?`}
                open={showDialog}
                close={setShowDialog}
                callback={(selection) => {
                    if (!selection) return

                    handleDelete(selectedRow)
                }} />
        </div>
    )
}

export { Guardians }