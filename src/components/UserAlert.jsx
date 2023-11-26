import React from 'react'
import { Alert, Snackbar } from '@mui/material'

function UserAlert({ type, message, duration, showAlert, setShowAlert }) {

    const handleClose = () => {
        setShowAlert(false)
    };

    return (
        <>
            <Snackbar
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                open={showAlert}
                autoHideDuration={duration}
                onClose={handleClose}
            >
                <Alert severity={type}>{message}</Alert>
            </Snackbar>
        </>
    )
}

export default UserAlert