import { useReducer } from 'react'

export function Student() {
    const [student, updateStudent] = useReducer((prev, next) => {
        return { ...prev, ...next }
    },
        {
            studentId: null,
            userAvatar: null,
            lastname: '',
            firstname: '',
            mi: '',
            grade_section: '',
            qr_data: null,
            guardian: '',
            dateAdded: ''
        });

    return { student, updateStudent };
}