import { useReducer } from 'react'

export function Guardian() {
    const [guardian, updateGuardian] = useReducer((prev, next) => {
        return { ...prev, ...next }
    },
        {
            guardianId: null,
            userAvatar: null,
            lastname: '',
            firstname: '',
            mi: '',
            phone: '',
            address: '',
            dateAdded: ''
        });

    return { guardian, updateGuardian };
}