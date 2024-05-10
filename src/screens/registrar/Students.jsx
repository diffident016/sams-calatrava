import React, { useState, useMemo } from "react";
import DataTable from "react-data-table-component";
import EmptyTable from "../../components/EmptyTable";
import { deleteStudent } from "../../api/Service";
import { PersonAdd, Edit, Delete } from "@mui/icons-material";
import { format } from "date-fns";
import Loader from "../../components/Loader";
import ShowDialog from "../../components/ShowDialog";

function Students({
  students,
  fetchState,
  setAddStudent,
  setEditStudent,
  setAlert,
  setShowAlert,
  type,
}) {
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState("");
  const [searchItems, setSearchItems] = useState([]);
  const [query, setQuery] = useState("");

  const handleDelete = async (docId) => {
    try {
      await deleteStudent(docId);
      setAlert({
        type: type.SUCCESS,
        message: "Student has been deleted successfully.",
        duration: 4000,
      });
      setShowAlert(true);
    } catch (e) {
      setAlert({
        type: type.ERROR,
        message: "Failed to delete the student.",
        duration: 4000,
      });
      setShowAlert(true);
    }
  };

  const columns = useMemo(() => [
    {
      name: "No.",
      selector: (row) => row.no,
      width: "60px",
    },
    {
      name: "Student ID",
      selector: (row) => row.studentId,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.name,
      width: "180px",
    },
    {
      name: "Grade & Section",
      selector: (row) => row.grade_section,
      width: "180px",
    },
    {
      name: "Guardian",
      selector: (row) =>
        !row.guardian || row.guardian == ""
          ? "Not specified"
          : row.guardian.name,
      width: "160px",
    },
    {
      name: "Gender",
      selector: (row) => row.gender,
      width: "80px",
    },
    {
      name: "Date Added",
      selector: (row) => format(row.dateAdded.toDate(), "LL/dd/yyyy"),
      width: "120px",
    },
    {
      name: "Actions",
      cell: function (row) {
        return (
          <div className="flex flex-row w-[100px] h-full items-center text-[20px] gap-2">
            <Edit
              onClick={() => {
                setEditStudent(row);
                setAddStudent(true);
              }}
              className="cursor-pointer"
              fontSize="inherit"
            />
            <div>|</div>
            <Delete
              onClick={() => {
                setSelectedRow(row.docId);
                setShowDialog(true);
              }}
              className="cursor-pointer"
              fontSize="inherit"
            />
          </div>
        );
      },
      width: "80px",
    },
  ]);

  const search = (query) => {
    var newRecords = students;

    newRecords = newRecords.filter((record) => {
      var name = record.name.toLowerCase().indexOf(query.toLowerCase());
      var id = record.studentId.indexOf(query.toLowerCase());
      return name !== -1 || id !== -1;
    });

    return newRecords;
  };

  return (
    <div className="w-full h-full bg-white border shadow-sm rounded-lg py-2 px-4 overflow-hidden">
      <div className="font-roboto text-[#607d8b] flex flex-col pt-4 px-4 gap-2 w-full h-full">
        <div className="flex flex-row justify-between py-2">
          <div className="flex flex-row items-center gap-4">
            <h1 className="font-roboto-bold text-lg">Student Records</h1>
            <div className="flex flex-row w-60 items-center gap-1">
              <input
                value={query}
                onChange={(e) => {
                  const query = e.target.value;
                  setQuery(query);
                  setSearchItems(search(query));
                }}
                className="px-2 text-sm rounded-md h-9 w-60 border focus:outline-none"
                placeholder="Search student..."
              />
              {query != "" && (
                <p
                  onClick={() => {
                    setQuery("");
                  }}
                  className="text-sm cursor-pointer opacity-60"
                >
                  clear
                </p>
              )}
            </div>
          </div>

          <div
            onClick={() => {
              setAddStudent(true);
            }}
            className="flex flex-row gap-2 items-center mx-4 cursor-pointer"
          >
            <PersonAdd color="inherit" />
            <h1 className="text-sm font-roboto-bold">Add Student</h1>
          </div>
        </div>
        <DataTable
          className="font-roboto rounded-md"
          columns={columns}
          data={query != "" ? searchItems : students}
          customStyles={{
            rows: {
              style: {
                color: "#607d8b",
                "font-family": "Roboto",
                "font-size": "14px",
              },
            },
            headCells: {
              style: {
                color: "#607d8b",
                "font-family": "Roboto",
                "font-size": "14px",
                "font-weight": "bold",
              },
            },
          }}
          persistTableHead
          progressPending={fetchState == 0 ? true : false}
          progressComponent={<Loader />}
          noDataComponent={
            <EmptyTable
              addEntry={setAddStudent}
              message={"There are no students on the record."}
              cta={"Add Student"}
            />
          }
          fixedHeader
          pagination
        />
      </div>
      <ShowDialog
        title={"Delete Student"}
        description={`Are you sure you want to delete this student?`}
        open={showDialog}
        close={setShowDialog}
        callback={(selection) => {
          if (!selection) return;

          handleDelete(selectedRow);
        }}
      />
    </div>
  );
}

export { Students };
