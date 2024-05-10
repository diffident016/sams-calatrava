import React, { useState, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import { format } from "date-fns";
import Loader from "../../components/Loader";
import { QrCode } from "@mui/icons-material";
import { Backdrop } from "@mui/material";
import QRPreview from "../../components/QRPreview";
import { Logs } from "../../components/Logs";
import { useReactToPrint } from "react-to-print";

function Students({ students, fetchState }) {
  const [selectedRow, setSelectedRow] = useState("");
  const [open, setOpen] = useState(false);
  const [logs, setLogs] = useState(null);
  const componentRef = useRef();
  const [searchItems, setSearchItems] = useState([]);
  const [query, setQuery] = useState("");
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const handleClose = () => {
    setOpen(false);
  };
  const handleOpen = () => {
    setOpen(true);
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
      name: "Date Added",
      selector: (row) => format(row.dateAdded.toDate(), "LL/dd/yyyy"),
      width: "120px",
    },
    {
      name: "Actions",
      cell: function (row) {
        return (
          <div className="flex flex-row items-center">
            <div
              onClick={() => {
                setSelectedRow(row);
                handleOpen();
              }}
              className="flex cursor-pointer flex-row w-[100px] h-full items-center text-[20px] gap-2"
            >
              <QrCode fontSize="inherit" />
              <p className="text-xs">QR Code</p>
            </div>
            <div
              onClick={() => {
                setLogs(row.studentId);
              }}
              className="w-12 text-white bg-[#49a54d] text-center py-1 rounded-lg text-xs cursor-pointer"
            >
              Logs
            </div>
          </div>
        );
      },
      width: "160px",
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
        <div className="flex flex-row items-center py-2 gap-4">
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
        <DataTable
          className="font-roboto rounded-md h-full overflow-hidden"
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
          fixedHeader
          allowOverflow
          pagination
        />
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={open}
        >
          {open && (
            <QRPreview
              data={selectedRow}
              close={() => {
                handleClose();
              }}
            />
          )}
        </Backdrop>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={!!logs}
          onClick={handleClose}
        >
          {!!logs && (
            <Logs
              print={() => {
                handlePrint();
              }}
              ref={componentRef}
              studentId={logs}
              close={() => {
                setLogs(null);
              }}
            />
          )}
        </Backdrop>
      </div>
    </div>
  );
}

export { Students };
