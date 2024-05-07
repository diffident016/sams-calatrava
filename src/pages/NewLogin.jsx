import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import { Students as Students1 } from "../screens/registrar/Students";
import { Students as Students2 } from "../screens/admin/Students";
import CheckAttendance from "./CheckAttendance";
import { Guardians } from "../screens/admin/Guardians";
import AddStudent from "../components/AddStudent";
import UserAlert from "../components/UserAlert";
import { Alert } from "../models/Alert";
import AddGuardian from "../components/AddGuardian";
import {
    getAllRecords,
    getAllStudents,
    onSnapshot,
    getAllGuardians,
    orderBy,
} from "../api/Service";
import { format } from "date-fns";
import Login from "./Login";

function NewLogin({ profile, userType }) {

    const [students, setStudents] = useState([]);
    const [showAlert, setShowAlert] = useState(false);
    const [records, setRecords] = useState([]);
    const [recordFetch, setRecordFetch] = useState(0);
    const [studentFetch, setStudentFetch] = useState(0);
    const [sms, setSms] = useState(true);
    const [rawRecords, setRawRecords] = useState([]);

    const { alert, setAlert, type } = Alert();

    useEffect(() => {
        const query = getAllStudents();

        try {
            const unsub = onSnapshot(query, (snapshot) => {
                if (!snapshot) {
                    setStudentFetch(-1);
                    return;
                }

                if (snapshot.empty) {
                    setStudentFetch(2);
                    return;
                }

                var students = snapshot.docs.map((doc) => {
                    const data = doc.data()["student"];

                    return {
                        docId: doc.id,
                        studentId: data.studentId,
                        firstname: data.firstname,
                        qr_data: data.qr_data,
                        mi: data.mi,
                        lastname: data.lastname,
                        grade_section: data.grade_section,
                        guardian: data.guardian,
                        guardian_name: data.guardian_name,
                        name: data.firstname + " " + data.mi + " " + data.lastname,
                        dateAdded: data.dateAdded,
                        gender: data.gender,
                    };
                });

                students.sort((a, b) => b.dateAdded - a.dateAdded);

                students = students.map((doc, index) => {
                    var data = doc;
                    data["no"] = index + 1;
                    return data;
                });

                setStudents(students);
                setStudentFetch(1);
            });

            return () => {
                unsub();
            };
        } catch {
            setStudentFetch(-1);
        }
    }, []);

    useEffect(() => {
        const query = getAllRecords();

        try {
            const unsub = onSnapshot(query, (snapshot) => {
                if (!snapshot) {
                    setRecordFetch(-1);
                    return;
                }

                if (snapshot.empty) {
                    setRecordFetch(2);
                    return;
                }

                var records = snapshot.docs.map((doc, index) => {
                    const data = doc.data()["record"];

                    return {
                        student: data.student,
                        dateRecord: data.dateRecord,
                        status: data.status,
                        sms: data.sms,
                    };
                });

                records.sort((a, b) => b.dateRecord - a.dateRecord);

                records = records.map((doc, index) => {
                    var data = doc;
                    data["no"] = index + 1;
                    return data;
                });

                const group = records.reduce((group, record) => {
                    const { dateRecord } = record;
                    group[format(dateRecord.toDate(), "yyyy/MM/dd")] =
                        group[format(dateRecord.toDate(), "yyyy/MM/dd")] ?? [];
                    group[format(dateRecord.toDate(), "yyyy/MM/dd")].push(record);
                    return group;
                }, {});

                setRawRecords(records);
                setRecords(group);
                setRecordFetch(1);
            });

            return () => {
                unsub();
            };
        } catch {
            setRecordFetch(-1);
        }
    }, []);

    // const screens = [

    //     {
    //         header: "Dashboard / Check Attendance",
    //         component: (
    //             <CheckAttendance
    //                 students={students}
    //                 setShowAlert={setShowAlert}
    //                 setAlert={setAlert}
    //                 type={type}
    //                 records={records}
    //                 fetchState={recordFetch}
    //                 sms={sms}
    //             />
    //         ),
    //     }
    // ];

    return <Login
        students={students}
        setShowAlert={setShowAlert}
        setAlert={setAlert}
        type={type}
        records={records}
        fetchState={recordFetch}
        sms={sms}
    />
        ;
}

export default NewLogin;
