import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">BookMyMeet</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-primary-600 font-medium">
              Home
            </Link>
            <Link to="/rooms" className="text-gray-700 hover:text-primary-600 font-medium">
              Rooms
            </Link>
            <Link to="/reviews" className="text-gray-700 hover:text-primary-600 font-medium">
              Reviews
            </Link>
            {user && (
              <Link to="/my-bookings" className="text-gray-700 hover:text-primary-600 font-medium">
                My Bookings
              </Link>
            )}
            {user?.role === 'admin' && (
              <div className="relative group">
                <button className="text-gray-700 hover:text-primary-600 font-medium flex items-center">
                  Admin
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-t-lg">
                    Dashboard
                  </Link>
                  <Link to="/admin/rooms" className="block px-4 py-2 text-gray-700 hover:bg-gray-50">
                    Manage Rooms
                  </Link>
                  <Link to="/add-room" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-b-lg">
                    Add Room
                  </Link>
                </div>
              </div>
            )}
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">
                  Hello, {user.name}
                  {user.role === 'admin' && (
                    <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      Admin
                    </span>
                  )}
                </span>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-3">
                <Link to="/login" className="btn-secondary">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-between">
              <span className="w-full h-0.5 bg-gray-600"></span>
              <span className="w-full h-0.5 bg-gray-600"></span>
              <span className="w-full h-0.5 bg-gray-600"></span>
            </div>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              <Link to="/rooms" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                Rooms
              </Link>
              <Link to="/reviews" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                Reviews
              </Link>
              {user && (
                <Link to="/my-bookings" className="text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                  My Bookings
                </Link>
              )}
              {user?.role === 'admin' && (
                <>
                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm font-medium text-gray-500 mb-2">Admin</p>
                    <Link to="/admin" className="block py-2 text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                      Dashboard
                    </Link>
                    <Link to="/admin/rooms" className="block py-2 text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                      Manage Rooms
                    </Link>
                    <Link to="/add-room" className="block py-2 text-gray-700 hover:text-primary-600" onClick={() => setIsMenuOpen(false)}>
                      Add Room
                    </Link>
                  </div>
                </>
              )}
              <div className="pt-4 border-t">
                {user ? (
                  <div className="flex flex-col space-y-3">
                    <span className="text-gray-700">
                      Hello, {user.name}
                      {user.role === 'admin' && (
                        <span className="ml-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                          Admin
                        </span>
                      )}
                    </span>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="btn-secondary text-left"
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col space-y-3">
                    <Link to="/login" className="btn-secondary text-center" onClick={() => setIsMenuOpen(false)}>
                      Login
                    </Link>
                    <Link to="/register" className="btn-primary text-center" onClick={() => setIsMenuOpen(false)}>
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header