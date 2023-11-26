import { useReducer } from 'react'

export function Alert() {

    const type = {
        ERROR: 'error',
        WARNING: 'warning',
        INFO: 'info',
        SUCCESS: 'success'
    }

    const [alert, setAlert] = useReducer((prev, next) => {
        return { ...prev, ...next }
    },
        {
            type: 'info',
            message: '',
            duration: 3000
        });


    return { alert, setAlert, type };
}