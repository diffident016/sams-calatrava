import React, { useState, useMemo } from 'react'
import DataTable from "react-data-table-component";
import { format } from 'date-fns'
import Loader from '../../components/Loader'
import { QrCode } from '@mui/icons-material';
import { Backdrop } from '@mui/material';
import QRPreview from '../../components/QRPreview';

function Students({ students, fetchState }) {

    const [selectedRow, setSelectedRow] = useState('');
    const [open, setOpen] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };
    const handleOpen = () => {
        setOpen(true);
    };

    const columns = useMemo(
        () => [
            {
                name: "No.",
                selector: (row) => row.no,
                width: '80px'
            },
            {
                name: "Student ID",
                selector: (row) => row.studentId,
                width: '130px'
            },
            {
                name: "Name",
                selector: (row) => row.name,
                width: '200px'
            },
            {
                name: "Grade & Section",
                selector: (row) => row.grade_section,
                width: '150px'
            },
            {
                name: "Guardian",
                selector: (row) => (!row.guardian || row.guardian == "") ? 'Not specified' : row.guardian,
                width: '160px'
            },
            {
                name: "Date Added",
                selector: (row) => format(row.dateAdded.toDate(), 'LL/dd/yyyy'),
                width: '120px'
            },
            {
                name: "Actions",
                cell: function (row) {

                    let data = row.data
                    data['docId'] = row.docId

                    return (
                        <div
                            onClick={() => {
                                setSelectedRow(data.studentId)
                                handleOpen()
                            }}
                            className="flex cursor-pointer flex-row w-[100px] h-full items-center text-[20px] gap-2">
                            <QrCode fontSize="inherit" />
                            <p className='text-xs'>QR Code</p>
                        </div>
                    )
                },
                width: '120px'
            },
        ]
    );

    return (
        <div className='w-full h-full bg-white border shadow-sm rounded-lg py-2 px-4'>
            <div className='font-roboto text-[#607d8b] flex flex-col p-4 gap-2 w-full'>
                <div className='flex flex-row justify-between py-2'>
                    <h1 className='font-roboto-bold text-lg'>Student Records</h1>
                </div>
                <DataTable
                    className="font-roboto rounded-md"
                    columns={columns}
                    data={students}
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
                    fixedHeader
                    fixedHeaderScrollHeight="370px"
                />
                <Backdrop
                    sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                    open={open}
                    onClick={handleClose}
                >
                    <QRPreview data={selectedRow} />
                </Backdrop>
            </div>
        </div>
    )
}

export { Students }