import React, { useState, useEffect, useMemo } from 'react'
import DataTable from "react-data-table-component";
import { QrScanner } from '@yudiel/react-qr-scanner';
import { format, differenceInMinutes } from 'date-fns'
import { addRecord, getAllRecords, Timestamp, onSnapshot } from '../api/Service';

function CheckAttendance({ students = [], setAlert, setShowAlert, type, }) {

    const [delay, setDelay] = useState(false)
    const [videoSelect, setVideoSelect] = useState([])
    const [labels, setLabels] = useState([])
    const [scanned, setScanned] = useState(null)
    const [records, setRecords] = useState([])
    const [fetchState, setFetchState] = useState(0)

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
        console.log(e)
    }

    const checkStatus = (id, date) => {

        const r = records.filter((record) => {
            return record.studentId == id
        })

        r.sort((a, b) => b.dateRecord - a.dateRecord);

        const record = r[0];

        if (!record) return 0

        const interval = differenceInMinutes(
            date.toDate(),
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

    useEffect(() => {
        const query = getAllRecords()

        try {
            const unsub = onSnapshot(query, snapshot => {
                if (!snapshot) {
                    setFetchState(-1)
                    return
                }

                if (snapshot.empty) {
                    setFetchState(2)
                    return
                }

                const records = snapshot.docs.map((doc, index) => {
                    const data = doc.data()['record'];

                    return {
                        no: index + 1,
                        studentId: data.studentId,
                        name: data.name,
                        dateRecord: data.dateRecord,
                        status: data.status
                    }
                });

                records.sort((a, b) => b.dateRecord - a.dateRecord);

                setRecords(records)
                setFetchState(1)
            })

            return () => {
                unsub()
            }

        } catch {
            setFetchState(-1)
        }

    }, [])

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
                    <div className=''>
                        <h1 className='font-roboto-bold'>Recorded Attendance</h1>
                    </div>
                    {
                        (fetchState != 1) ?
                            <div className='flex flex-row w-full h-full justify-center items-center'>
                                <p className='text-sm'>No records, scan QR to add.</p>
                            </div>
                            : <DataTable
                                className="font-roboto rounded-md"
                                columns={columns}
                                data={records}
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