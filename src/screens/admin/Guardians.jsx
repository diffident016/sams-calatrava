import React, { useMemo, useState } from 'react'
import DataTable from "react-data-table-component";
import { format } from 'date-fns'
import Loader from '../../components/Loader'
import { KeyboardArrowDown } from '@mui/icons-material';

function Guardians({ guardians, fetchState }) {

    const [query, setQuery] = useState('')
    const [searchItems, setSearchItems] = useState([])

    const columns = useMemo(
        () => [
            {
                name: "Name",
                selector: (row) => row.name,
                width: '220px'
            },
            {
                name: "Phone Number",
                selector: (row) => row.phone,
                width: '180px'
            },
            {
                name: "Date/Time",
                selector: (row) => format(row.dateAdded.toDate(), 'LL/dd/yyyy - hh:mm a'),
                width: '200px'
            },
            {
                name: "SMS Type",
                cell: function (row) {
                    return (
                        false ?
                            <div className="flex bg-[#339655] rounded-sm items-center justify-center w-[60px] h-[20px] cursor-pointer">
                                <p className="font-roboto-bold text-white text-xs">
                                    INSIDE
                                </p>
                            </div> :
                            <div className="flex bg-[#fb0200] rounded-sm items-center justify-center w-[60px] h-[20px] cursor-pointer">
                                <p className="font-roboto-bold text-white text-xs">
                                    OUTSIDE
                                </p>
                            </div>
                    )
                },
                width: '150px'
            },
            {
                name: "SMS Status",
                cell: function (row) {
                    return (
                        <p className='border border-[#49a54d] py-[1px] text-xs text-[#49a54d] font-roboto-bold px-2 rounded-lg'>SENT</p>
                    )
                },
                width: '150px'
            }
        ]
    );

    const search = (query) => {

        var newRecords = records[format(date, 'yyyy/MM/dd')];

        newRecords = newRecords.filter((record) => {
            var name = record.name.toLowerCase().indexOf(query.toLowerCase());
            var id = record.studentId.indexOf(query.toLowerCase());
            return name !== -1 || id !== -1;
        });

        return newRecords;
    }

    return (
        <div className='w-full h-full bg-white border shadow-sm rounded-lg py-2 px-4'>
            <div className='font-roboto text-[#607d8b] flex flex-col p-4 gap-2 w-full'>
                <div className='flex flex-col h-20'>
                    <h1 className='font-roboto-bold text-lg'>Guardian SMS Notification</h1>
                    <div className='flex flex-row my-4 w-full items-center justify-between'>
                        <div className='flex flex-row w-60 items-center gap-1'>
                            <input
                                value={query}
                                onChange={(e) => {
                                    const query = e.target.value
                                    setQuery(query)
                                    setSearchItems(search(query))
                                }}
                                className='px-2 text-sm rounded-md h-8 w-52 border focus:outline-none'
                                placeholder='Search student...' />
                            {query != '' && <p
                                onClick={() => { setQuery('') }}
                                className='text-sm cursor-pointer opacity-60'>clear</p>}
                        </div>
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
                    fixedHeader
                    fixedHeaderScrollHeight="370px"
                />
            </div>
        </div>
    )
}

export { Guardians }