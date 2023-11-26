import { Delete, Edit } from "@mui/icons-material"

const studentTable =
    [
        {
            name: "No.",
            selector: (row) => row.no,
            width: '80px'
        },
        {
            name: "Student ID",
            selector: (row) => row.studentId,
            width: '130px'
        },
        {
            name: "Name",
            selector: (row) => row.name,
            width: '200px'
        },
        {
            name: "Grade & Section",
            selector: (row) => row.grade_section,
            width: '150px'
        },
        {
            name: "Guardian",
            selector: (row) => !row.guardian ? 'Not specified' : row.guardian,
            width: '180px'
        },
        {
            name: "Date Added",
            selector: (row) => row.dateAdded,
            width: '130px'
        },
        {
            name: "Actions",
            cell: function (row) {

                console.log(row)

                return (
                    <div className="flex flex-row w-[100px] h-full items-center text-[20px] gap-2">
                        <Edit className="cursor-pointer" fontSize="inherit" />
                        <div>|</div>
                        <Delete className="cursor-pointer" fontSize="inherit" />
                    </div>
                )
            },
            width: '100px'
        },
        // {
        //     cell: (row) => (
        //         <div className="flex items-center w-[100px] h-[25px] cursor-pointer">
        //             <p
        //                 className="bg-[#339655] px-2 py-1 rounded-md text-[#ffffff]"
        //                 onClick={() => handleAction(row)}
        //             >
        //                 Check
        //             </p>
        //         </div>
        //     ),
        //     ignoreRowClick: true,
        //     allowOverflow: true,
        //     button: true,
        // },


    ]


export { studentTable }