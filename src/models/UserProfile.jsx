import { useReducer } from 'react'

export function UserProfile() {
    const [profile, updateProfile] = useReducer((prev, next) => {
        return { ...prev, ...next }
    },
        {
            userId: null,
            userType: null,
            userAvatar: null,
            lastname: '',
            firstname: '',
            mi: '',
            occupation: '',
            phone: '',
            admin: false
        });

    return { profile, updateProfile };
}





