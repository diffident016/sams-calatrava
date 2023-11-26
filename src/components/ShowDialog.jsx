import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';

function ShowDialog({ title, description, open, close, callback }) {

    return (
        <Dialog
            open={open}
            onClose={() => { close(false) }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent className='font-roboto text-sm'>
                {description}
            </DialogContent>
            <DialogActions>
                <Button onClick={() => {
                    callback(true)
                    close(false)
                }} autoFocus>
                    Yes
                </Button>
                <Button color='inherit' onClick={() => {
                    callback(false)
                    close(false)
                }}>Cancel</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ShowDialog