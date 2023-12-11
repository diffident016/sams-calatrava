import { format } from "date-fns";

const baseUrl = 'http://localhost:5000/api';

const getMessage = async () => {

    fetch('http://localhost:5000/api', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
        .then((res) => {

            console.log(res.status)
            return res.json()
        }).then((res) => {
            console.log(res)
        })
        .catch(err => console.error(err));
}

const sendSMS = async (report) => {

    if (!report.student.guardian || report.student.guardian == '') return

    const student = report.student.name
    const number = report.student.guardian.phone
    const date = format(report.dateRecord.toDate(), 'EEEE, MMMM dd, yyyy')
    const time = format(report.dateRecord.toDate(), 'hh:mm a')

    const status = {
        "0": 'entered',
        "1": 'exited'
    }

    const msg = `Greetings! Your child ${student} ${status[report.status]} school on ${date} at ${time}. Best regards, CSHS.`

    console.log(number)
    console.log(msg)
    fetch(`${baseUrl}/send`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
        },
        body: JSON.stringify({
            number: number,
            message: msg
        })
    }).then((res) => {
        return res.json()
    }).then((res) => {
        console.log(res)
    })
}

const getAccount = async () => {

    return fetch(`${baseUrl}/account`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
    })
}

export { getMessage, getAccount, sendSMS }