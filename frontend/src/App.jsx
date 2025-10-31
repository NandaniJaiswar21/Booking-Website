import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Rooms from './pages/Rooms'
import RoomDetails from './pages/RoomDetails'
import Booking from './pages/Booking'
import MyBookings from './pages/MyBookings'
import Reviews from './pages/Reviews'
import VerifyEmail from './pages/VerifyEmail'
import AddRoom from './pages/AddRoom'
import WriteReview from './pages/WriteReview'
import AdminDashboard from './pages/AdminDashboard'
import AdminRooms from './pages/AdminRooms'

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/rooms/:id" element={<RoomDetails />} />
            <Route path="/booking/:roomId" element={<Booking />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/write-review/:roomId" element={<WriteReview />} />
            <Route path="/add-room" element={<AddRoom />} />
            
            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/rooms" element={<AdminRooms />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </AuthProvider>
  )
}

export default App