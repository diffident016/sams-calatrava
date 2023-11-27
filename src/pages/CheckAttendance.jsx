import React, { useState, useEffect, useMemo } from 'react'
import DataTable from "react-data-table-component";
import { QrScanner } from '@yudiel/react-qr-scanner';
import { format } from 'date-fns'

function CheckAttendance({ students = [] }) {

    const [delay, setDelay] = useState(false)
    const [videoSelect, setVideoSelect] = useState([])
    const [labels, setLabels] = useState([])
    const [scanned, setScanned] = useState(null)

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
        }
    ]

    const handleError = (e) => {
        console.log(e)
    }

    const handleScan = (data) => {

        const student = getStudent(data)

        console.log(student)
        setScanned(student)
    }

    const getStudent = (id) => {

        if (students.length < 1) return status[0]

        const student = students.find(student => student.studentId == id)

        return !student ? status[1] : { status: 2, student }
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
                name: "No.",
                selector: (row) => row.no,
                width: '60px'
            },
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
                selector: (row) => format(row.dateAdded.toDate(), 'LL/dd/yyyy'),
                width: '110px'
            },
            {
                name: "Time",
                selector: (row) => format(row.dateAdded.toDate(), 'HH:MM a'),
                width: '110px'
            },
            {
                name: "Status",
                cell: function (row) {

                    let data = row.data
                    data['docId'] = row.docId

                    return (
                        <div className="flex bg-[#339655] rounded-sm items-center justify-center w-[90px] h-[20px] cursor-pointer">
                            <p className="font-roboto-bold text-white text-xs">
                                INSIDE
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
                <div className='flex-1 h-full bg-white border shadow-sm rounded-lg p-4'>
                    <h1 className='font-roboto-bold'>Recorded Attendance</h1>
                    {
                        (!students || students.length < 0) ?
                            <div className='flex flex-row w-full h-full justify-center items-center'>
                                <p className='text-sm'>No records, scan QR to add.</p>
                            </div>
                            : <DataTable
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
                                fixedHeader
                                fixedHeaderScrollHeight="330px"
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