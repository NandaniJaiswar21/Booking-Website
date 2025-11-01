import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import axios from 'axios'
import QRCodeDisplay from '../components/QRCodeDisplay'

const MyBookings = () => {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      fetchBookings()
    }
  }, [user])

  const fetchBookings = async () => {
    try {
      setError('')
      const response = await axios.get('http://localhost:5000/api/bookings/my-bookings')
      setBookings(response.data)
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError('Failed to load bookings. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return

    try {
      await axios.put(`http://localhost:5000/api/bookings/${bookingId}/cancel`)
      alert('Booking cancelled successfully!')
      fetchBookings()
    } catch (error) {
      console.error('Error cancelling booking:', error)
      alert('Failed to cancel booking. Please try again.')
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      case 'completed':
        return 'bg-blue-100 text-blue-800'
      case 'no-show':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading your bookings...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-red-600">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>

        {bookings.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">No bookings yet</h3>
            <p className="text-gray-600 mb-6">Start by booking your first meeting room!</p>
            <a href="/rooms" className="btn-primary">
              Browse Rooms
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <div key={booking._id} className="card p-6">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {booking.room?.name || 'Room details not available'}
                        </h3>
                        <p className="text-gray-600">{booking.room?.type || 'N/A'}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <span className="block text-sm font-medium text-gray-700">Date</span>
                        <span className="text-gray-900">
                          {new Date(booking.bookingDate).toLocaleDateString()}
                        </span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-700">Time</span>
                        <span className="text-gray-900">
                          {booking.startTime} - {booking.endTime}
                        </span>
                      </div>
                      <div>
                        <span className="block text-sm font-medium text-gray-700">Amount</span>
                        <span className="text-gray-900">₹{booking.totalAmount}</span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-700 mb-2">
                        Location
                      </span>
                      <span className="text-gray-900">{booking.room?.location || 'Location not available'}</span>
                    </div>

                    {/* QR Code Section */}
                    <div className="mb-4">
                      <span className="block text-sm font-medium text-gray-700 mb-2">
                        QR Code for Check-in
                      </span>
                      <div className="bg-white p-4 border rounded-lg inline-block">
                        <QRCodeDisplay 
                          qrData={booking.qrCode} 
                          bookingId={booking._id} 
                        />
                        <p className="text-xs text-gray-600 mt-2 text-center">
                          Show this QR code at reception for check-in
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 md:mt-0 md:ml-6 flex space-x-3">
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn-secondary whitespace-nowrap"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings