import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import { useAuth } from "../auth/AuthContext";
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
import sound from "../assets/sound/qr-tone.mp3";

function Login({
  students = [],
  records,
  fetchState,
  setAlert,
  type,
  setShowAlert,
  sms,
}) {
  const [error, setError] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const { login } = useAuth();
  const navigate = useNavigate();

  const tone = new Audio(sound);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await login(email, password);
      navigate("/");
    } catch (e) {
      console.log(e);
      setError("Invalid email or password.");
    }
  };

  const [logs, setLogs] = useState(null);
  const [videoSelect, setVideoSelect] = useState([]);
  const [labels, setLabels] = useState([]);
  const [scanned, setScanned] = useState(null);
  const [searchItems, setSearchItems] = useState([]);
  const [query, setQuery] = useState("");
  const [date, setDate] = useState(new Date());
  const [datepick, setDatePick] = useState(false);

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
    tone.play();
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

  return (
    <div className="w-full h-full flex flex-col overflow-auto">
      <div className="font-roboto-bold text-[#323232] w-full h-screen flex flex-row justify-center items-center p-4">
        <div className="flex-1 h-full flex flex-col items-center justify-center gap-4">
          <img src={logo} className="w-48 h-48" />
          <h1 className="w-[60%] text-center font-bold text-3xl">
            Calatrava SHS QR Code Student Monitoring System
          </h1>
        </div>

        <div className="flex-1 h-full flex flex-row p-24 items-center justify-center">
          <div className="w-[500px] h-[500px] flex flex-col items-center border rounded-lg shadow-sm bg-white pt-8">
            <h1 className="font-bold text-2xl text-[#1F2F3D]">LOGIN</h1>
            <p className="font-roboto py-4">
              Enter your email and password to Log In.
            </p>
            <div className="z-10 flex flex-col w-[650px] items-center">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col z-10 w-[350px] py-4 font-arimo text-[#1F2F3D]"
              >
                <label className="py-2 text-sm font-bold">Email Address</label>
                <input
                  type="text"
                  value={email}
                  className="px-2 border font-roboto text-[#1F2F3D] border-[#1F2F3D] h-10 rounded-lg"
                  name="username"
                  pattern="([A-Za-z0-9][._]?)+[A-Za-z0-9]@[A-Za-z0-9]+(\.?[A-Za-z0-9]){2}\.(com?|net|org)+(\.[A-Za-z0-9]{2,4})?"
                  title="Please enter a valid email"
                  required={true}
                  onChange={(e) => {
                    setEmail(e.target.value.trim());
                  }}
                />
                <label className="mt-3 py-2 text-sm font-bold">Password</label>
                <input
                  type="password"
                  value={password}
                  className="px-2 border text-[#1F2F3D] border-[#1F2F3D] h-10 rounded-lg"
                  name="username"
                  required={true}
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                />
                <button
                  type="submit"
                  className="mt-8 flex w-full h-10 bg-[#49a54d] rounded-lg justify-center items-center"
                >
                  <p className="text-white text-sm font-bold">Log In</p>
                </button>
                <p
                  className={`${
                    error ? "opacity-100" : "opacity-0"
                  } p-2 h-4 text-xs font-bold text-[#E8090C]`}
                >
                  {error}
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-screen flex item-center justify-center p-12">
        <div className="flex flex-col w-[500px] h-[500px] gap-2">
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
      </div>
    </div>
  );
}

export default Login;
