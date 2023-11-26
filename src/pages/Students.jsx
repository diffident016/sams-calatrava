import React, { useEffect, useState, useMemo } from 'react'
import DataTable from "react-data-table-component";
import EmptyTable from '../components/EmptyTable';
import { studentTable } from '../models/TableColumns';
import { deleteStudent, getAllStudents, onSnapshot, Timestamp } from '../api/Service';
import { PersonAdd, Edit, Delete } from '@mui/icons-material';
import { format } from 'date-fns'
import Loader from '../components/Loader'
import ShowDialog from '../components/ShowDialog';

function Students({ addStudent, setAddStudent, setEditStudent, setAlert, setShowAlert, type }) {

    const [students, setStudents] = useState([]);
    const [fetchState, setFetchState] = useState(0);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedRow, setSelectedRow] = useState('');

    useEffect(() => {
        const query = getAllStudents()

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

                const students = snapshot.docs.map((doc, index) => {
                    const data = doc.data()['student'];

                    return {
                        no: index + 1,
                        docId: doc.id,
                        studentId: data.studentId,
                        grade_section: data.grade_section,
                        guardian: data.guardian,
                        name: data.firstname + " " + data.mi + " " + data.lastname,
                        dateAdded: data.dateAdded,
                        data: data
                    };
                });

                setStudents(students)
                setFetchState(1)
            })

            return () => {
                unsub()
            }

        } catch {
            setFetchState(-1)
        }
    }, [])

    const handleDelete = async (docId) => {

        try {
            await deleteStudent(docId)
            setAlert({
                type: type.SUCCESS,
                message: 'Student has been deleted successfully.',
                duration: 4000
            })
            setShowAlert(true)
        } catch (e) {
            setAlert({
                type: type.ERROR,
                message: 'Failed to delete the student.',
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
                width: '180px'
            },
            {
                name: "Date Added",
                selector: (row) => format(row.dateAdded.toDate(), 'LL/dd/yyyy'),
                width: '130px'
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
                                    setEditStudent(data)
                                    setAddStudent(true)
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
                width: '100px'
            },
        ]
    );

    return (
        <div className='w-full h-full bg-white border shadow-sm rounded-lg py-2 px-4'>
            <div className='font-roboto text-[#607d8b] flex flex-col p-4 gap-2 w-full'>
                <div className='flex flex-row justify-between py-2'>
                    <h1 className='font-roboto-bold text-lg'>Student Records</h1>
                    <div onClick={() => { setAddStudent(true) }} className='flex flex-row gap-2 items-center mx-4 cursor-pointer'>
                        <PersonAdd color='inherit' />
                        <h1 className='text-sm font-roboto-bold'>Add Student</h1>
                    </div>
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
                    progressPending={fetchState == 0 ? true : false}
                    progressComponent={<Loader />}
                    noDataComponent={<EmptyTable setAddStudent={setAddStudent} />}
                    fixedHeader
                    fixedHeaderScrollHeight="330px"
                    pagination
                />
            </div>
            <ShowDialog
                title={'Delete Student'}
                description={`Are you sure you want to delete this student?`}
                open={showDialog}
                close={setShowDialog}
                callback={(selection) => {
                    if (!selection) return

                    handleDelete(selectedRow)
                }} />
        </div>
    )
}

export default Students