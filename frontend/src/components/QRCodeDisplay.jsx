import { QRCodeSVG } from 'qrcode.react'

const QRCodeDisplay = ({ qrData, bookingId }) => {
  // If we have booking ID, generate QR code from it
  if (bookingId) {
    return (
      <div className="text-center">
        <QRCodeSVG 
          value={bookingId} 
          size={128}
          level="H"
          includeMargin={true}
          className="mx-auto"
        />
        <p className="text-xs text-gray-500 mt-2">
          Scan for check-in
        </p>
      </div>
    )
  }

  // If we have QR data that's a URL
  if (qrData && qrData.startsWith('http')) {
    return (
      <img 
        src={qrData} 
        alt="QR Code"
        className="w-32 h-32 mx-auto"
      />
    )
  }

  // If we have other QR data, try to display it
  if (qrData) {
    return (
      <div className="text-center">
        <QRCodeSVG 
          value={qrData} 
          size={128}
          level="H"
          includeMargin={true}
          className="mx-auto"
        />
        <p className="text-xs text-gray-500 mt-2">
          Scan for check-in
        </p>
      </div>
    )
  }

  // Fallback if no data
  return (
    <div className="text-center text-gray-500">
      <div className="w-32 h-32 border-2 border-dashed border-gray-300 rounded flex items-center justify-center mx-auto">
        No QR Code
      </div>
      <p className="text-xs mt-2">QR code not available</p>
    </div>
  )
}

export default QRCodeDisplay