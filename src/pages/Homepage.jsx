import React, { useState } from 'react'
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

function Homepage({ profile, userType }) {

    const [screen, setScreen] = useState(0);
    const [students, setStudents] = useState([]);
    const [addStudent, setAddStudent] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [editStudent, setEditStudent] = useState(null)
    const [editGuardian, setEditGuardian] = useState(null)
    const [addGuardian, setAddGuarian] = useState(false)
    const [guardiansEntry, setGuardiansEntry] = useState([])

    const { alert, setAlert, type } = Alert();

    const screens = [
        { header: 'Dashboard / Home', component: <Dashboard /> },
        {
            header: 'Dashboard / Students', component:
                userType === 1 ?
                    <Students2
                        setEditStudent={setEditStudent}
                        setAddStudent={setAddStudent}
                        setShowAlert={setShowAlert}
                        setAlert={setAlert}
                        setStudents={setStudents}
                        students={students}
                        type={type} /> :
                    <Students1
                        setEditStudent={setEditStudent}
                        setAddStudent={setAddStudent}
                        setShowAlert={setShowAlert}
                        setAlert={setAlert}
                        setStudents={setStudents}
                        students={students}
                        type={type} />
        },
        { header: 'Dashboard / Check Attendance', component: <CheckAttendance students={students} /> },
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
        },
        { header: 'Dashboard / Settings', component: <Settings /> }
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
                    <Navbar userType={userType} setScreen={setScreen} screen={screen} />
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