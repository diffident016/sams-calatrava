import { Female, Groups, Male, Upcoming } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';
import { format, isToday, isYesterday, parse } from 'date-fns';
import React, { useEffect, useState } from 'react'
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function Demographics({ students, records, studentFetch, recordFetch }) {

    const [data, setData] = useState([]);
    const [population, setPopulation] = useState({
        total: 0,
        male: 0,
        female: 0
    });

    useEffect(() => {
        if (students.length < 1) return;

        console.log(students);

        const group = students.reduce((group, student) => {
            const { gender } = student;
            group[gender] = group[gender] ?? [];
            group[gender].push(student);
            return group;
        }, {});

        setPopulation({
            total: students.length,
            male: !group['Male'] ? 0 : group['Male'].length,
            female: !group['Female'] ? 0 : group['Female'].length
        });

    }, [students]);

    useEffect(() => {
        console.log(records)
        let temp = [];

        Object.keys(records).map((r) => {
            const studentCount = students.length;

            if (studentCount < 1) return

            let finalGroup = {};

            const groupRecords = records[r].reduce((group, record) => {
                const { gender } = record.student;
                group[gender] = group[gender] ?? [];
                group[gender].push(record);
                return group;
            }, {});

            Object.keys(groupRecords).map((key) => {
                const group = groupRecords[key].reduce((group, record) => {
                    const { status } = record;
                    group[status == 0 ? 'in' : 'out'] = group[status == 0 ? 'in' : 'out'] ?? [];
                    group[status == 0 ? 'in' : 'out'].push(record);
                    return group;
                }, {});

                finalGroup[key] = group;
            });

            temp.push({
                name: formatDate(r),
                [`Female (in)`]: !finalGroup['Female'] ? 0 : !finalGroup['Female']['in'] ? 0 : finalGroup['Female']['in'].length,
                [`Female (out)`]: !finalGroup['Female'] ? 0 : !finalGroup['Female']['out'] ? 0 : finalGroup['Female']['out'].length,
                [`Male (in)`]: !finalGroup['Male'] ? 0 : !finalGroup['Male']['in'] ? 0 : finalGroup['Male']['in'].length,
                [`Male (out)`]: !finalGroup['Male'] ? 0 : !finalGroup['Male']['out'] ? 0 : finalGroup['Male']['out'].length,
            });

        });

        setData(temp);

    }, [records])

    const formatDate = (date) => {

        if (isToday(parse(date, 'yyyy/MM/dd', new Date()))) {
            return 'Today'
        } else if (isYesterday(parse(date, 'yyyy/MM/dd', new Date()))) {
            return 'Yesterday'
        }

        return date
    }



    const StateBuilder = (state) => {

        const states = {
            "2": {
                icon: <Upcoming />,
                text: 'No statistics'
            },
            "-1": {
                icon: <Error />,
                text: 'Something went wrong.'
            },
            "0": {
                icon: <CircularProgress className='text-[#49a54d]' color='inherit' />,
                text: 'Loading statistics...'
            }
        }

        console.log(state)

        return (
            <div className='flex flex-col h-full justify-center items-center gap-4 text-[#607d8b]'>
                {/* {states[`${state}`].icon} */}
                <p className='text-sm'>{states[`${state}`].text}</p>
            </div>
        )
    }

    return (
        <div className='w-full h-full flex flex-row gap-5 font-roboto text-[#607d8b]'>
            <div className='w-2/3 h-96 border shadow-sm bg-white rounded-xl py-4 '>
                <h1 className='px-6 font-roboto-bold text-lg'>Demographics <span className='text-sm font-light'>(Today's Activity by Gender)</span></h1>
                <ResponsiveContainer className='pt-4 text-sm' width="100%" height="90%">
                    <BarChart
                        width={500}
                        height={250}
                        data={data}
                        margin={{
                            top: 5,
                            right: 30,
                            left: 20,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="2 2" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="Male (in)" stackId='a' fill="#49a54d" />
                        <Bar dataKey="Male (out)" stackId='a' fill="#5a8c5d" />
                        <Bar dataKey="Female (in)" stackId='b' fill="#a54b49" />
                        <Bar dataKey="Female (out)" stackId='b' fill="#8c5b5a" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className='w-1/3 h-96 border shadow-sm bg-white rounded-xl px-6  py-4'>
                <div className='flex flex-col gap-3'>
                    <div className='flex flex-col'>
                        <h1 className='font-roboto-bold'>Total Students</h1>
                        <div className='flex flex-row items-center gap-2 py-2'>
                            <div className='flex items-center  justify-center h-11 w-11 border rounded-lg shadow-sm'>
                                <Groups fontSize='medium' />
                            </div>
                            <h1 className='font-roboto-bold text-sm'>{population.total} students</h1>
                        </div>
                    </div>
                    <div className='flex flex-col'>
                        <h1 className='font-roboto-bold'>Male Students</h1>
                        <div className='flex flex-row items-center gap-2 py-2'>
                            <div className='flex items-center  justify-center h-11 w-11 border rounded-lg shadow-sm'>
                                <Male fontSize='medium' />
                            </div>
                            <h1 className='font-roboto-bold text-sm'>{population.male} students</h1>
                        </div>

                    </div>
                    <div className='flex flex-col'>
                        <h1 className='font-roboto-bold'>Female Students</h1>
                        <div className='flex flex-row items-center gap-2 py-2'>
                            <div className='flex items-center  justify-center h-11 w-11 border rounded-lg shadow-sm'>
                                <Female fontSize='medium' />
                            </div>
                            <h1 className='font-roboto-bold text-sm'>{population.female} students</h1>
                        </div>

                    </div>
                </div>
            </div>

        </div>

    )
}

export default Demographics