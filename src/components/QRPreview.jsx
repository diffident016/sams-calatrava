import React from 'react'
import QRCode from "react-qr-code";

function QRPreview({ data }) {
    return (
        <div className='flex flex-col p-6 w-[350px] h-[350px] bg-white border shadow-sm rounded-lg text-[#607d8b] font-roboto'>
            <div style={{ height: "auto", margin: "0 auto", maxWidth: 250, width: "100%" }}>
                <QRCode
                    size={256}
                    style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                    value={data}
                    viewBox={`0 0 256 256`}
                />
            </div>
            <p className='py-6 text-center'>{data}</p>
        </div>
    )
}

export default QRPreview