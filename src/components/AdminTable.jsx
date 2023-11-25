import React, { useEffect, useState, useMemo } from 'react'
import DataTable from "react-data-table-component";

function AdminTable() {

    const data =
        [
            {
                "no": 1,
                "id": 2020302020,
                "name": 'Robby William Oblig',
                "grade_section": 'Grade 12 - STEM',
                "datetime": '2023-11-25 - 2:30PM',
                "status": 0,
            },
            {
                "no": 2,
                "id": 2020302021,
                "name": 'Jomarie Ysteen Agnes',
                "grade_section": 'Grade 12 - HUMSS',
                "datetime": '2023-11-25 - 2:30PM',
                "status": 0,
            }, {
                "no": 3,
                "id": 2020302022,
                "name": 'Ryand Sacote',
                "grade_section": 'Grade 12 - STEM',
                "datetime": '2023-11-25 - 2:30PM',
                "status": 0,
            }
        ]


    const columns = useMemo(
        () => [
            {
                name: "No.",
                selector: (row) => row.no,
                width: '80px'
            },
            {
                name: "Student ID",
                selector: (row) => row.id,
                width: '150px'
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
                name: "Date & Time",
                selector: (row) => row.datetime,
                width: '200px'
            },
            {
                name: "Status",
                selector: (row) => row.status,
                width: '100px'
            },
            // {
            //     cell: (row) => (
            //         <div className="flex items-center w-[100px] h-[25px] cursor-pointer">
            //             <p
            //                 className="bg-[#339655] px-2 py-1 rounded-md text-[#ffffff]"
            //                 onClick={() => handleAction(row)}
            //             >
            //                 Check
            //             </p>
            //         </div>
            //     ),
            //     ignoreRowClick: true,
            //     allowOverflow: true,
            //     button: true,
            // },

        ],
        []
    );

    return (
        <div className='flex-1 h-96 border shadow-sm bg-white rounded-xl'>
            <div className='font-roboto text-[#607d8b] flex flex-col p-5 gap-2'>
                <h1 className='font-roboto-bold text-lg'>Student Record</h1>
                <DataTable
                    className="font-roboto rounded-md"
                    columns={columns}
                    data={data}
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
                    // progressPending={loading}
                    fixedHeader
                    fixedHeaderScrollHeight="330px"
                    pagination
                // subHeader
                // subHeaderComponent={subHeaderComponentMemo}
                />
            </div>
        </div>
    )
}

export default AdminTable