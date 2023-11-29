import React, { useState, useEffect, useMemo } from 'react'
import DataTable from "react-data-table-component";
import { QrScanner } from '@yudiel/react-qr-scanner';
import { format, differenceInMinutes } from 'date-fns'
import { addRecord, getAllRecords, Timestamp, onSnapshot } from '../api/Service';
import { DateCalendar } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import { KeyboardArrowDown } from '@mui/icons-material';

function CheckAttendance({ students = [], setAlert, setShowAlert, type, records, fetchState }) {

    const [delay, setDelay] = useState(false)
    const [videoSelect, setVideoSelect] = useState([])
    const [labels, setLabels] = useState([])
    const [scanned, setScanned] = useState(null)
    const [searchItems, setSearchItems] = useState([])
    const [query, setQuery] = useState('')
    const [date, setDate] = useState(new Date())
    const [datepick, setDatePick] = useState(false)

    const status = [
        {
            status: 0,
            message: 'No students on the record.'
        },
        {
            status: 1,
            message: 'Invalid QR Code.'
        },
        {
            status: -1,
            message: 'An error occured.'
        },
        {
            status: -2,
            message: 'Only allowed to scan every minute.'
        }
    ]

    const handleError = (e) => {
        return setScanned(status[2])
    }

    const checkStatus = (id, d) => {

        let temp = records[format(date, 'yyyy/MM/dd')];

        if (!temp) return 0

        const r = temp.filter((record) => {
            return record.studentId == id
        })

        r.sort((a, b) => b.dateRecord - a.dateRecord);

        const record = r[0];

        if (!record) return 0

        const interval = differenceInMinutes(
            d.toDate(),
            record.dateRecord.toDate(),
        )

        if (interval < 1) return -2

        return (record.status == 0) ? 1 : 0
    }

    const handleScan = async (data) => {

        let student = getStudent(data)

        setScanned(student)

        if (student.status != 2) return student

        student = student.student

        const dateRecord = Timestamp.now()
        const st = checkStatus(student.studentId, dateRecord)

        if (st == -2) return setScanned(status[3])

        const record = {
            studentId: student.studentId,
            name: student.name,
            grade_section: student.grade_section,
            dateRecord: dateRecord,
            status: st
        }

        try {
            await addRecord(record)

        } catch (e) {
            console.log(e)
        }
    }

    const getStudent = (id) => {

        if (students.length < 1) return status[0]

        const student = students.find(student => student.studentId == id)

        return !student ? status[1] : { status: 2, student }
    }

    const search = (query) => {

        var newRecords = records[format(date, 'yyyy/MM/dd')];

        newRecords = newRecords.filter((record) => {
            var name = record.name.toLowerCase().indexOf(query.toLowerCase());
            var id = record.studentId.indexOf(query.toLowerCase());
            return name !== -1 || id !== -1;
        });

        return newRecords;
    }

    useEffect(() => {

        var devices = []
        var labels = []

        navigator.mediaDevices.enumerateDevices().then((devicesInfo) => {
            devicesInfo.forEach((deviceInfo, i) => {
                if (deviceInfo.kind === 'videoinput') {
                    labels.push({ label: deviceInfo.label, value: deviceInfo })
                    devices.push(deviceInfo)
                }
            })
        });

        setVideoSelect(devices);
        setLabels(labels)
    }, [])

    const columns = useMemo(
        () => [
            {
                name: "Student ID",
                selector: (row) => row.studentId,
                width: '100px'
            },
            {
                name: "Name",
                selector: (row) => row.name,
                width: '200px'
            },
            {
                name: "Date Record",
                selector: (row) => format(row.dateRecord.toDate(), 'LL/dd/yyyy'),
                width: '110px'
            },
            {
                name: "Time",
                selector: (row) => format(row.dateRecord.toDate(), 'hh:mm a'),
                width: '110px'
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
                width: '100px'
            },
        ]
    );

    return (
        <div className='w-full h-full text-[#607d8b]'>
            <div className='flex flex-row w-full h-full gap-2'>
                <div className='flex-1 h-full flex flex-col bg-white border shadow-sm rounded-lg p-4 gap-4'>
                    <div className='h-16 flex flex-col'>
                        <h1 className='font-roboto-bold'>Recorded Attendance</h1>
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
                            <div className='relative '>
                                <div className='flex flex-row items-center gap-2 select-none w-full'>
                                    <p className='text-sm'>Select Date: </p>
                                    <div
                                        onClick={() => {
                                            setDatePick(!datepick)
                                        }}
                                        className='w-[190px] cursor-pointer flex flex-row items-center pl-2 pr-1 gap-1 h-8 border justify-between rounded-md'>
                                        <p className='text-sm read-only'>{format(date, 'EEEE, MM/dd/yyyy')}</p>
                                        <KeyboardArrowDown fontSize='small' />
                                    </div>
                                </div>

                                {datepick && <div className='absolute z-10 border shadow-sm bg-white ml-[-50px]'>
                                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                                        <DateCalendar
                                            defaultValue={dayjs(date)}
                                            maxDate={dayjs(new Date())}
                                            onChange={(e) => {
                                                setDatePick(!datepick)
                                                setDate(e.$d)
                                            }}
                                        />
                                    </LocalizationProvider>
                                </div>}
                            </div>

                        </div>
                    </div>
                    {
                        (fetchState != 1) ?
                            <div className='flex flex-row w-full h-full justify-center items-center'>
                                <p className='text-sm'>No records, scan QR to add.</p>
                            </div>
                            : <DataTable
                                className="font-roboto rounded-md"
                                columns={columns}
                                data={(query != '') ? searchItems : records[format(date, 'yyyy/MM/dd')]}
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
                <div className='flex flex-col w-1/3 h-full gap-2'>
                    <div className='flex-1 h-full bg-white border shadow-sm rounded-lg py-4 px-4'>
                        <h1 className='font-roboto-bold text-sm'>QR Scanner</h1>
                        <div className='flex w-full justify-center py-2'>
                            <div className='w-[250px]'>
                                <QrScanner
                                    scanDelay={3000}
                                    onDecode={(result) => handleScan(result)}
                                    onError={(error) => handleError(error?.message)}
                                />
                            </div>
                        </div>

                    </div>
                    <div className='flex flex-col h-1/3 bg-white border shadow-sm rounded-lg p-4'>
                        <h1 className='font-roboto-bold text-sm'>Scanned Data</h1>
                        <div className='flex flex-col font-roboto gap-1 px-2 py-4'>

                            {
                                !scanned && (<p className='text-center text-sm'>Scan QR Code now.</p>)
                            }
                            {
                                (scanned && scanned.status != 2) && (<p className='text-center text-sm'>{scanned.message}</p>)
                            }
                            {
                                (scanned && scanned.status == 2) && (
                                    <div className='w-full h-full flex flex-col gap-2 text-[#607d8b]'>
                                        <p className='text-xs'>Student ID: <span className='font-roboto-bold'>{scanned.student.studentId}</span></p>
                                        <p className='text-xs'>Student Name: <span className='font-roboto-bold'>{scanned.student.name}</span></p>
                                        <p className='text-xs'>Grade&Section: <span className='font-roboto-bold'>{scanned.student.grade_section}</span></p>
                                        <p className='text-xs'>Student Status: {0}</p>
                                    </div>
                                )
                            }


                        </div>
                    </div>
                </div>
            </div>


        </div>
    )
}

export default CheckAttendance