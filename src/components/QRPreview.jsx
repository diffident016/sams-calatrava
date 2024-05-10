import html2canvas from "html2canvas";
import React from "react";
import QRCode from "react-qr-code";
import { Close } from "@mui/icons-material";

function QRPreview({ data, close }) {
  const downloadID = async () => {
    const element = document.getElementById("print"),
      canvas = await html2canvas(element),
      img = canvas.toDataURL("image/jpg"),
      link = document.createElement("a");

    link.href = img;
    link.download = `${data.studentId}.jpg`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="relative w-[350px] h-[350px] text-[#607d8b]">
      <Close
        onClick={() => {
          close();
        }}
        fontSize="small"
        color="inherit"
        className="absolute right-4 top-4 cursor-pointer select-none"
      />
      <div
        id="print"
        className="flex flex-col p-6 w-full h-full bg-white border shadow-sm rounded-lg  font-roboto"
      >
        <div
          style={{
            height: "auto",
            margin: "0 auto",
            maxWidth: 180,
            width: "100%",
          }}
        >
          <QRCode
            size={120}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
            value={data.studentId}
            viewBox={`0 0 256 256`}
          />
        </div>
        <div className="w-full flex flex-col p-2 py-4 ">
          <p className="text-base font-roboto-bold">
            Name: <span className="font-roboto">{data.name}</span>
          </p>
          <p className="text-base font-roboto-bold">
            Grade & Section:{" "}
            <span className="font-roboto">{data.grade_section}</span>
          </p>
        </div>

        {/* <p className="py-6 text-center">{data}</p> */}
      </div>
      <div className="absolute bottom-5 w-full flex px-4">
        <button
          onClick={() => {
            downloadID();
          }}
          className=" border border-[#607d8b] text-sm p-2 rounded-lg text-[#607d8b] w-full"
        >
          Download ID
        </button>
      </div>
    </div>
  );
}

export default QRPreview;
