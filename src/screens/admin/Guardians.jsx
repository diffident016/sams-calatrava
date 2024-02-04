import React, { useMemo, useState, useEffect } from 'react'
import { format, formatDistance } from 'date-fns'
import { KeyboardArrowDown, Upcoming, Campaign, CampaignOutlined } from '@mui/icons-material';
import { getAccount } from '../../api/SMSService';
import { CircularProgress, Switch } from '@mui/material';

function Guardians({ guardians, fetchState, records, recordFetch, sms, setSms }) {

    const [query, setQuery] = useState('')
    const [searchItems, setSearchItems] = useState([])
    const [credits, setCredits] = useState(0)
    const [date, setDate] = useState(new Date())
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        setIsLoading(true)
        getAccount().then((res) => {
            return res.json()
        }).then((res) => {
            if (res.credit_balance) {
                setCredits(res.credit_balance)
            }

            setIsLoading(false)
        })
            .catch(err => console.error(err));
    }, [])

    const search = (query) => {

        var newRecords = records[format(date, 'yyyy/MM/dd')];

        newRecords = newRecords.filter((record) => {
            var name = record.name.toLowerCase().indexOf(query.toLowerCase());
            var id = record.studentId.indexOf(query.toLowerCase());
            return name !== -1 || id !== -1;
        });

        return newRecords;
    }

    const StateBuilder = (state) => {

        const states = {
            "2": {
                icon: <Upcoming />,
                text: 'No entries'
            },
            "-1": {
                icon: <Error />,
                text: 'Something went wrong.'
            },
            "0": {
                icon: <CircularProgress className='text-[#49a54d]' color='inherit' />,
                text: 'Loading, please wait...'
            }
        }

        return (
            <div className='flex flex-col h-full justify-center items-center gap-4 text-[#607d8b]'>
                {states[`${state}`].icon}
                <p className='text-sm'>{states[`${state}`].text}</p>
            </div>
        )
    }

    const messageConstructor = (report) => {

        const status = {
            "0": "ENTER",
            "1": "EXIT"
        }

        return <p className='py-3 text-sm'>
            A SMS message was sent to Mrs./Mr. <span className='font-roboto-bold'>{report.student.guardian.name} </span>
            to give information about her/his child <span className='font-roboto-bold'>{report.student.name}, {status[report.status]} </span>
            the school on <span className='font-roboto-bold'>{format(report.dateRecord.toDate(), 'EEEE, MMMM dd, yyyy')} at
                {format(report.dateRecord.toDate(), ' hh:mm a')}</span>.
        </p>
    }

    return (
        <div className='w-full h-full flex flex-row gap-2'>
            <div className='w-full h-full bg-white border shadow-sm rounded-lg py-2 px-4'>
                <div className='font-roboto text-[#607d8b] flex flex-col p-4 gap-2 w-full h-full'>
                    <div className='flex flex-col h-10'>
                        <h1 className='font-roboto-bold text-lg'>Guardian SMS Report</h1>
                    </div>
                    <div className='w-full h-full'>
                        {
                            fetchState != 1 ?
                                <div className='h-full w-full flex items-center justify-center'>
                                    {StateBuilder(fetchState)}
                                </div> :

                                <div className='flex flex-col gap-2 h-[400px] overflow-auto'>
                                    {
                                        !records[format(date, 'yyyy/MM/dd')] ? <p className='py-40 text-center'>No records...</p> :
                                            records[format(date, 'yyyy/MM/dd')].filter((item) => item.sms && item.student.guardian).length == 0 ? <p className='py-40 text-center'>No records...</p> :
                                                records[format(date, 'yyyy/MM/dd')].filter((item) => item.sms).map((items) => {
                                                    return (
                                                        <div className='flex flex-col px-4 py-4 h-36 w-full shadow-sm border rounded-[10px]'>
                                                            <div className='flex flex-row text-[22px] items-center gap-2'>
                                                                <CampaignOutlined fontSize='inherit' className='' />
                                                                <h1 className='font-roboto-bold text-base'>Guardian Report</h1>
                                                            </div>
                                                            {messageConstructor(items)}
                                                            <p className='py-1 text-sm'>{formatDistance(items.dateRecord.toDate(), new Date(), { addSuffix: true })}</p>
                                                        </div>
                                                    )
                                                })
                                    }
                                </div>
                        }
                    </div>

                </div>
            </div>
            <div className='w-[500px] h-full bg-white border shadow-sm rounded-lg py-2 px-4'>
                <div className='font-roboto text-[#607d8b] flex flex-col p-4 gap-2 w-full h-full'>
                    {
                        isLoading ?
                            <div className='flex flex-col h-full w-full items-center justify-center gap-4'>
                                <>
                                    <CircularProgress className='text-[#49a54d]' color='inherit' />
                                    <p className='text-sm'>Loading service, please wait...</p>
                                </>

                            </div> :
                            <div className='flex flex-col'>
                                <h1 className='font-roboto-bold text-lg'>SMS Balance</h1>
                                <div className='flex flex-col w-full items-center justify-center py-7'>
                                    <h1 className='font-roboto text-3xl'>{credits} credits</h1>
                                    <p className='text-sm py-4'>1 credit is equivalent to 1 SMS.</p>
                                </div>
                                <h1 className='py-4 font-roboto-bold text-lg'>SMS Service</h1>
                                <div className='w-full flex flex-row gap-2 items-center'>
                                    <Switch checked={sms} size='small' onChange={(e) => {
                                        setSms(e.target.checked)
                                    }} />
                                    <p className='text-sm'>{`SMS service ${sms ? 'enabled' : 'disabled'}.`}</p>
                                </div>
                            </div>
                    }


                </div>
            </div>
        </div>
    )
}

export { Guardians }