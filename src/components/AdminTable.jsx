import React, { useMemo } from 'react'
import DataTable from "react-data-table-component";
import { Upcoming, Error } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { format } from 'date-fns'

function AdminTable({ fetchState, records }) {

    const StateBuilder = (state) => {

        const states = {
            "2": {
                icon: <Upcoming />,
                text: 'No records'
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
            <div className='flex flex-col h-full justify-center items-center gap-4 text-[#607d8b]'>
                <p className='text-sm'>{states[`${state}`].text}</p>
            </div>
        )
    }


    const columns = useMemo(
        () => [
            {
                name: "No.",
                selector: (row) => row.no,
                width: '80px'
            },
            {
                name: "Student ID",
                selector: (row) => row.student.studentId,
                width: '150px'
            },
            {
                name: "Name",
                selector: (row) => row.student.name,
                width: '200px'
            },
            {
                name: "Date Record",
                selector: (row) => format(row.dateRecord.toDate(), 'eeee - MMM dd, yyyy'),
                width: '220px'
            },
            {
                name: "Time",
                selector: (row) => format(row.dateRecord.toDate(), 'hh:mm a'),
                width: '150px'
            },
            {
                name: "Status",
                cell: function (row) {
                    return (
                        row.status == 0 ?
                            <div className="flex bg-[#339655] rounded-sm items-center justify-center w-[90px] h-[20px] cursor-pointer">
                                <p className="font-roboto-bold text-white text-xs">
                                    INSIDE
                                </p>
                            </div> :
                            <div className="flex bg-[#fb0200] rounded-sm items-center justify-center w-[90px] h-[20px] cursor-pointer">
                                <p className="font-roboto-bold text-white text-xs">
                                    OUTSIDE
                                </p>
                            </div>
                    )
                },
                width: '150px'
            },
        ],
        []
    );

    return (
        <div className='flex-1 h-full border shadow-sm bg-white rounded-xl'>
            <div className='font-roboto text-[#607d8b] flex flex-col p-5 gap-2'>
                <div className='flex flex-row items-center gap-2'>
                    <h1 className='font-roboto-bold text-lg'>Student Record</h1>
                    <p className='border border-[#49a54d] py-[1px] text-xs text-[#49a54d] font-roboto-bold px-2 rounded-lg'>Today</p>
                </div>

                {
                    fetchState != 1 ? StateBuilder(fetchState) :
                        <DataTable
                            className="font-roboto rounded-md"
                            columns={columns}
                            data={records[format(new Date(), 'yyyy/MM/dd')]}
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
                            fixedHeader
                            fixedHeaderScrollHeight="370px"
                            pagination
                        />
                }

            </div>
        </div>
    )
}

export default AdminTable