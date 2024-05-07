import React, { useState, useEffect, useMemo, useRef } from "react";
import DataTable from "react-data-table-component";
import { QrScanner } from "@yudiel/react-qr-scanner";
import { format, differenceInMinutes } from "date-fns";
import { addRecord, Timestamp } from "../api/Service";
import { DateCalendar } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { History, KeyboardArrowDown } from "@mui/icons-material";
import { sendSMS } from "../api/SMSService";
import { Backdrop } from "@mui/material";
import { Logs } from "../components/Logs";
import { useReactToPrint } from "react-to-print";

function CheckAttendance({
  students = [],
  records,
  fetchState,
  setAlert,
  type,
  setShowAlert,
  sms,
}) {
  const [logs, setLogs] = useState(null);
  const [videoSelect, setVideoSelect] = useState([]);
  const [labels, setLabels] = useState([]);
  const [scanned, setScanned] = useState(null);
  const [searchItems, setSearchItems] = useState([]);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState(new Date());
  const [datepick, setDatePick] = useState(false);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const status = [
    {
      status: 0,
      message: "No students on the record.",
    },
    {
      status: 1,
      message: "Invalid QR Code.",
    },
    {
      status: -1,
      message: "An error occured.",
    },
    {
      status: -2,
      message: "Only allowed to scan every minute.",
    },
  ];

  const handleError = (e) => {
    return setScanned(status[2]);
  };

  const checkStatus = (id, d) => {
    let temp = records[format(date, "yyyy/MM/dd")];

    if (!temp) return 0;

    const r = temp.filter((record) => {
      return record.student.studentId == id;
    });

    r.sort((a, b) => b.dateRecord - a.dateRecord);

    const record = r[0];

    if (!record) return 0;

    const interval = differenceInMinutes(
      d.toDate(),
      record.dateRecord.toDate()
    );

    if (interval < 1) return -2;

    return record.status == 0 ? 1 : 0;
  };

  const handleScan = async (data) => {
    let student = getStudent(data);

    setScanned(student);

    if (student.status != 2) return student;

    student = student.student;

    const dateRecord = Timestamp.now();
    const st = checkStatus(student.studentId, dateRecord);

    if (st == -2) return setScanned(status[3]);

    const record = {
      student: student,
      dateRecord: dateRecord,
      status: st,
    };

    try {
      record["sms"] = sms;
      await addRecord(record);

      setAlert({
        type: type.SUCCESS,
        message: "Attendance has been recorded successfully.",
        duration: 3000,
      });
      setShowAlert(true);

      if (!sms) return;
      await sendSMS(record);
    } catch (e) {
      console.log(e);

      setAlert({
        type: type.FAIL,
        message: "Failed to record attendance.",
        duration: 3000,
      });
      setShowAlert(true);
    }
  };

  const getStudent = (id) => {
    if (students.length < 1) return status[0];

    const student = students.find((student) => student.studentId == id);

    return !student ? status[1] : { status: 2, student };
  };

  const search = (query) => {
    var newRecords = records[format(date, "yyyy/MM/dd")];

    newRecords = newRecords.filter((record) => {
      var name = record.name.toLowerCase().indexOf(query.toLowerCase());
      var id = record.studentId.indexOf(query.toLowerCase());
      return name !== -1 || id !== -1;
    });

    return newRecords;
  };

  useEffect(() => {
    var devices = [];
    var labels = [];

    navigator.mediaDevices.enumerateDevices().then((devicesInfo) => {
      devicesInfo.forEach((deviceInfo, i) => {
        if (deviceInfo.kind === "videoinput") {
          labels.push({ label: deviceInfo.label, value: deviceInfo });
          devices.push(deviceInfo);
        }
      });
    });

    setVideoSelect(devices);
    setLabels(labels);
  }, []);

  const columns = useMemo(() => [
    {
      name: "Student ID",
      selector: (row) => row.student.studentId,
      width: "100px",
    },
    {
      name: "Name",
      selector: (row) => row.student.name,
      width: "200px",
    },
    {
      name: "Date Record",
      selector: (row) => format(row.dateRecord.toDate(), "LL/dd/yyyy"),
      width: "110px",
    },
    {
      name: "Time",
      selector: (row) => format(row.dateRecord.toDate(), "hh:mm a"),
      width: "110px",
    },
    {
      name: "Status",
      cell: function (row) {
        return row.status == 0 ? (
          <div className="flex bg-[#339655] rounded-sm items-center justify-center w-[90px] h-[20px] cursor-pointer">
            <p className="font-roboto-bold text-white text-xs">INSIDE</p>
          </div>
        ) : (
          <div className="flex bg-[#fb0200] rounded-sm items-center justify-center w-[90px] h-[20px] cursor-pointer">
            <p className="font-roboto-bold text-white text-xs">OUTSIDE</p>
          </div>
        );
      },
      width: "100px",
    },
  ]);

  return (
    <div className="w-full h-full text-[#607d8b] overflow-hidden">
      <div className="flex flex-row w-full h-full gap-2 ">
        <div className="flex-1 h-full flex flex-col bg-white border shadow-sm rounded-lg pt-4 px-4 ">
          <div className="flex flex-row pt-2 mb-2 h-12 justify-between ">
            <h1 className="font-roboto-bold text-lg">Recorded Attendance</h1>
            <p
              onClick={() => {
                setLogs(true);
              }}
              className="flex cursor-pointer hover:bg-black/10 flex-row items-center rounded-lg justify-center gap-1 text-sm w-20 border h-8"
            >
              <span>
                <History fontSize="small" />
              </span>
              Logs
            </p>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-row w-full items-center justify-end">
              <div className="relative ">
                <div className="flex flex-row items-center gap-2 select-none w-full">
                  <p className="text-sm">Select Date: </p>
                  <div
                    onClick={() => {
                      setDatePick(!datepick);
                    }}
                    className="w-[190px] cursor-pointer flex flex-row items-center pl-2 pr-1 gap-1 h-8 border justify-between rounded-md"
                  >
                    <p className="text-sm read-only">
                      {format(date, "EEEE, MM/dd/yyyy")}
                    </p>
                    <KeyboardArrowDown fontSize="small" />
                  </div>
                </div>

                {datepick && (
                  <div className="absolute z-10 border shadow-sm bg-white ml-[-50px]">
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DateCalendar
                        defaultValue={dayjs(date)}
                        maxDate={dayjs(new Date())}
                        onChange={(e) => {
                          setDatePick(!datepick);
                          setDate(e.$d);
                        }}
                      />
                    </LocalizationProvider>
                  </div>
                )}
              </div>
            </div>
          </div>
          {fetchState != 1 ? (
            <div className="flex flex-row w-full h-full justify-center items-center">
              <p className="text-sm">No records, scan QR to add.</p>
            </div>
          ) : (
            <DataTable
              className="font-roboto rounded-md"
              columns={columns}
              data={
                query != "" ? searchItems : records[format(date, "yyyy/MM/dd")]
              }
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
              fixedHeader
              pagination
            />
          )}
        </div>
        <div className="flex flex-col w-1/3 h-full gap-2">
          <div className="flex-1 h-full bg-white border shadow-sm rounded-lg py-4 px-4">
            <h1 className="font-roboto-bold">QR Scanner</h1>
            <div className="flex w-full justify-center py-2">
              <div className="w-[250px]">
                <QrScanner
                  scanDelay={3000}
                  onDecode={(result) => handleScan(result)}
                  onError={(error) => handleError(error?.message)}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col h-1/3 bg-white border shadow-sm rounded-lg p-4">
            <h1 className="font-roboto-bold">Scanned Data</h1>
            <div className="flex flex-col font-roboto gap-1 px-2 py-4">
              {!scanned && (
                <p className="text-center text-sm">Scan QR Code now.</p>
              )}
              {scanned && scanned.status != 2 && (
                <p className="text-center text-sm">{scanned.message}</p>
              )}
              {scanned && scanned.status == 2 && (
                <div className="w-full h-full flex flex-col gap-2 text-[#607d8b]">
                  <p className="text-sm">
                    Student ID:{" "}
                    <span className="font-roboto-bold">
                      {scanned.student.studentId}
                    </span>
                  </p>
                  <p className="text-sm">
                    Student Name:{" "}
                    <span className="font-roboto-bold">
                      {scanned.student.name}
                    </span>
                  </p>
                  <p className="text-sm">
                    Grade&Section:{" "}
                    <span className="font-roboto-bold">
                      {scanned.student.grade_section}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={!!logs}
        >
          {!!logs && (
            <Logs
              print={() => {
                handlePrint();
              }}
              ref={componentRef}
              all={logs}
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

export default CheckAttendance;