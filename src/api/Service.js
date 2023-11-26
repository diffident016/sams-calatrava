import {
    doc,
    collection,
    setDoc,
    addDoc,
    Timestamp,
    updateDoc,
    deleteDoc,
    arrayUnion,
    arrayRemove,
    getDoc,
    getDocs,
    where,
    query,
    orderBy,
    onSnapshot
} from 'firebase/firestore';

import {
    ref,
    uploadBytesResumable,
    getDownloadURL
} from "firebase/storage";

import { db, storage } from '../../firebase'

const addUserProfile = (userId, profile) => {

    return setDoc(doc(db, "users", userId), {
        profile
    });

}

const addStudent = (student) => {

    const id = String(Date.now()).slice(5, 13)

    var student = student;
    student['studentId'] = id
    student['qr_data'] = id
    student['dateAdded'] = Timestamp.now()

    return addDoc(collection(db, "students"), {
        student
    });

}

const editStudentInfo = (docId, student) => {

    return updateDoc(doc(db, "students", docId), {
        student
    });
}

const deleteStudent = (docId) => {

    return deleteDoc(doc(db, "students", docId))
}

const getAllStudents = () => {
    const studentRef = collection(db, "students");

    return studentRef;
}

const getUser = (userId) => {
    return getDoc(doc(db, "users", userId));
}

export {
    addStudent,
    getAllStudents,
    editStudentInfo,
    deleteStudent,
    addUserProfile,
    getUser,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    storage,
    onSnapshot,
    Timestamp
}
