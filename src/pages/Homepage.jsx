import React, { useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import Dashboard from './Dashboard';
import Students from './Students';
import CheckAttendance from './CheckAttendance';
import Guardians from './Guardians';
import Settings from './Settings';
import AddStudent from '../components/AddStudent';
import UserAlert from '../components/UserAlert';
import { Alert } from '../models/Alert';

function Homepage({ profile, userType }) {

    const [screen, setScreen] = useState(0);
    const [addStudent, setAddStudent] = useState(false)
    const [showAlert, setShowAlert] = useState(false)
    const [editStudent, setEditStudent] = useState(null)

    const { alert, setAlert, type } = Alert();

    const screens = [
        { header: 'Dashboard / Home', component: <Dashboard /> },
        {
            header: 'Dashboard / Students', component:
                <Students
                    setEditStudent={setEditStudent}
                    setAddStudent={setAddStudent}
                    setShowAlert={setShowAlert}
                    setAlert={setAlert}
                    type={type} />
        },
        { header: 'Dashboard / Check Attendance', component: <CheckAttendance /> },
        { header: 'Dashboard / Guardians', component: <Guardians /> },
        { header: 'Dashboard / Settings', component: <Settings /> }
    ].filter((_, index) => {
        return index !== (userType === 1 ? 4 : 2);
    });

    return (
        <div className='w-full h-screen p-4 font-roboto'>
            <AddStudent
                show={addStudent}
                close={setAddStudent}
                setShowAlert={setShowAlert}
                setAlert={setAlert}
                type={type}
                editStudent={editStudent}
                setEditStudent={setEditStudent}
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