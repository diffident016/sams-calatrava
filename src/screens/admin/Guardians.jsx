import React, { useEffect, useState, useMemo } from 'react'
import DataTable from "react-data-table-component";
import { getAllGuardians, onSnapshot } from '../../api/Service';
import { format } from 'date-fns'
import Loader from '../../components/Loader'

function Guardians() {

    const [guardians, setGuardians] = useState([]);
    const [fetchState, setFetchState] = useState(0);

    useEffect(() => {
        const query = getAllGuardians()

        try {
            const unsub = onSnapshot(query, snapshot => {
                if (!snapshot) {
                    setFetchState(-1)
                    return
                }

                if (snapshot.empty) {
                    setFetchState(2)
                    return
                }

                const guardians = snapshot.docs.map((doc, index) => {
                    const data = doc.data()['guardian'];

                    return {
                        no: index + 1,
                        docId: doc.id,
                        name: data.firstname + " " + data.mi + " " + data.lastname,
                        phone: data.phone,
                        dateAdded: data.dateAdded,
                        data: data
                    };
                });

                setGuardians(guardians)
                setFetchState(1)
            })

            return () => {
                unsub()
            }

        } catch {
            setFetchState(-1)
        }
    }, [])

    const columns = useMemo(
        () => [
            {
                name: "No.",
                selector: (row) => row.no,
                width: '80px'
            },
            {
                name: "Name",
                selector: (row) => row.name,
                width: '250px'
            },
            {
                name: "Phone Number",
                selector: (row) => row.phone,
                width: '250px'
            },
            {
                name: "Date Added",
                selector: (row) => format(row.dateAdded.toDate(), 'LL/dd/yyyy'),
                width: '180px'
            }
        ]
    );

    return (
        <div className='w-full h-full bg-white border shadow-sm rounded-lg py-2 px-4'>
            <div className='font-roboto text-[#607d8b] flex flex-col p-4 gap-2 w-full'>
                <div className='flex flex-row justify-between py-2'>
                    <h1 className='font-roboto-bold text-lg'>Guardian Records</h1>
                </div>
                <DataTable
                    className="font-roboto rounded-md"
                    columns={columns}
                    data={guardians}
                    customStyles={
                        {
                            rows: {
                                style: {
                                    'color': '#607d8b',
                                    'font-family': 'Roboto',
                                    'font-size': '14px'
                                },
                            },
                            headCells: {
                                style: {
                                    'color': '#607d8b',
                                    'font-family': 'Roboto',
                                    'font-size': '14px',
                                    'font-weight': 'bold'
                                },
                            }
                        }
                    }
                    persistTableHead
                    progressPending={fetchState == 0 ? true : false}
                    progressComponent={<Loader />}
                    fixedHeader
                    fixedHeaderScrollHeight="370px"
                    pagination
                />
            </div>
        </div>
    )
}

export { Guardians }