import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Dashboard from './Dashboard';
import { Students as Students1 } from '../screens/registrar/Students';
import { Students as Students2 } from '../screens/admin/Students';
import CheckAttendance from './CheckAttendance';
import { Guardians as Guardians1 } from '../screens/registrar/Guardians';
import { Guardians as Guardians2 } from '../screens/admin/Guardians';
import Settings from './Settings';
import AddStudent from '../components/AddStudent';
import UserAlert from '../components/UserAlert';
import { Alert } from '../models/Alert';
import AddGuardian from '../components/AddGuardian';
import { getAllRecords, getAllStudents, onSnapshot, Timestamp } from '../api/Service';
import { format } from 'date-fns'

function Homepage({ profile, userType }) {

    const [screen, setScreen] = useState(0);
    const [students, setStudents] = useState([]);
    const [addStudent, setAddStudent] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [editStudent, setEditStudent] = useState(null)
    const [editGuardian, setEditGuardian] = useState(null)
    const [addGuardian, setAddGuarian] = useState(false)
    const [guardiansEntry, setGuardiansEntry] = useState([])
    const [records, setRecords] = useState([])
    const [recordFetch, setRecordFetch] = useState(0)
    const [studentFetch, setStudentFetch] = useState(0)

    const { alert, setAlert, type } = Alert();

    useEffect(() => {
        const query = getAllStudents()

        try {
            const unsub = onSnapshot(query, snapshot => {
                if (!snapshot) {
                    setStudentFetch(-1)
                    return
                }

                if (snapshot.empty) {
                    setStudentFetch(2)
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
                setStudentFetch(1)
            })

            return () => {
                unsub()
            }

        } catch {
            setStudentFetch(-1)
        }
    }, [])

    useEffect(() => {
        const query = getAllRecords()

        try {
            const unsub = onSnapshot(query, snapshot => {
                if (!snapshot) {
                    setRecordFetch(-1)
                    return
                }

                if (snapshot.empty) {
                    setRecordFetch(2)
                    return
                }

                var records = snapshot.docs.map((doc, index) => {
                    const data = doc.data()['record'];

                    return {
                        studentId: data.studentId,
                        name: data.name,
                        dateRecord: data.dateRecord,
                        status: data.status
                    }
                });

                records.sort((a, b) => b.dateRecord - a.dateRecord);

                records = records.map((doc, index) => {
                    var data = doc;
                    data['no'] = index + 1
                    return data
                });

                const group = records.reduce((group, record) => {
                    const { dateRecord } = record;
                    group[format(dateRecord.toDate(), 'yyyy/MM/dd')] = group[format(dateRecord.toDate(), 'yyyy/MM/dd')] ?? [];
                    group[format(dateRecord.toDate(), 'yyyy/MM/dd')].push(record);
                    return group;
                }, {});

                setRecords(group)
                setRecordFetch(1)
            })

            return () => {
                unsub()
            }

        } catch {
            setRecordFetch(-1)
        }

    }, [])

    const screens = [
        {
            header: 'Dashboard / Home', component:
                <Dashboard
                    students={students}
                    studentFetch={studentFetch}
                    records={records}
                    recordFetch={recordFetch}
                />
        },
        {
            header: 'Dashboard / Students', component:
                userType === 1 ?
                    <Students2
                        setEditStudent={setEditStudent}
                        setAddStudent={setAddStudent}
                        setShowAlert={setShowAlert}
                        setAlert={setAlert}
                        fetchState={studentFetch}
                        students={students}
                        type={type} /> :
                    <Students1
                        setEditStudent={setEditStudent}
                        setAddStudent={setAddStudent}
                        setShowAlert={setShowAlert}
                        setAlert={setAlert}
                        fetchState={studentFetch}
                        students={students}
                        type={type} />
        },
        {
            header: 'Dashboard / Check Attendance', component:
                <CheckAttendance
                    students={students}
                    setShowAlert={setShowAlert}
                    setAlert={setAlert}
                    type={type}
                    records={records}
                    fetchState={recordFetch}
                />
        },
        {
            header: 'Dashboard / Guardians', component:
                userType === 1 ?
                    <Guardians2 /> :
                    <Guardians1
                        setEditGuardian={setEditGuardian}
                        setAddGuardian={setAddGuarian}
                        setShowAlert={setShowAlert}
                        setAlert={setAlert}
                        setGuardiansEntry={setGuardiansEntry}
                        type={type} />
        }
    ].filter((_, index) => {
        return index !== (userType === 1 ? 4 : 2);
    });

    return (
        <div className='relative w-full h-screen p-4 font-roboto overflow-hidden'>
            <AddStudent
                show={addStudent}
                close={setAddStudent}
                setShowAlert={setShowAlert}
                setAlert={setAlert}
                type={type}
                editStudent={editStudent}
                setEditStudent={setEditStudent}
                guardiansEntry={guardiansEntry}
            />
            <AddGuardian
                show={addGuardian}
                close={setAddGuarian}
                setShowAlert={setShowAlert}
                setAlert={setAlert}
                type={type}
                editGuardian={editGuardian}
                setEditGuardian={setEditGuardian}
            />

            <div className='flex flex-row w-full h-full gap-x-6 overflow-hidden'>
                <Sidebar userType={userType} screen={screen} setScreen={setScreen} />
                <div className='w-full h-full flex flex-col gap-5'>
                    <Navbar userType={userType} setScreen={setScreen} screen={screen} screens={screens[screen]} />
                    {screens[screen].component}
                </div>
            </div>
            {showAlert && <UserAlert
                type={alert.type}
                message={alert.message}
                duration={alert.duration}
                showAlert={showAlert}
                setShowAlert={setShowAlert}
            />}
        </div>
    )
}

export default Homepage