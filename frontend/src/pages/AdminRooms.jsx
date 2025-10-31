import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminRooms = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchRooms();
    }
  }, [user]);

  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/admin/rooms');
      setRooms(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/admin/rooms/${roomId}`);
      setRooms(rooms.filter(room => room._id !== roomId));
      alert('Room deleted successfully');
    } catch (error) {
      console.error('Error deleting room:', error);
      alert('Failed to delete room');
    }
  };

  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Admin Access Required</h2>
          <p>You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Rooms</h1>
            <p className="text-gray-600 mt-2">Add, edit, or remove rooms from the system</p>
          </div>
          <Link
            to="/add-room"
            className="btn-primary"
          >
            Add New Room
          </Link>
        </div>

        {/* Rooms List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="card p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex space-x-2">
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                  <div className="h-8 bg-gray-200 rounded w-20"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {rooms.length === 0 ? (
              <div className="card p-12 text-center">
                <div className="text-6xl mb-4">🏢</div>
                <h3 className="text-xl font-semibold mb-2">No Rooms Yet</h3>
                <p className="text-gray-600 mb-6">Start by adding your first room!</p>
                <Link to="/add-room" className="btn-primary">
                  Add First Room
                </Link>
              </div>
            ) : (
              rooms.map((room) => (
                <div key={room._id} className="card p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">{room.name}</h3>
                          <p className="text-gray-600">{room.type} • {room.location}</p>
                        </div>
                        <span className="bg-primary-100 text-primary-800 text-sm font-medium px-3 py-1 rounded-full">
                          {room.type}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Capacity</span>
                          <span className="text-gray-900">{room.capacity} people</span>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Price</span>
                          <span className="text-gray-900">₹{room.pricePerHour}/hour</span>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Facilities</span>
                          <span className="text-gray-900">{room.facilities.length}</span>
                        </div>
                        <div>
                          <span className="block text-sm font-medium text-gray-700">Status</span>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            room.isAvailable 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {room.isAvailable ? 'Available' : 'Unavailable'}
                          </span>
                        </div>
                      </div>

                      <div className="mb-4">
                        <span className="block text-sm font-medium text-gray-700 mb-2">Description</span>
                        <p className="text-gray-900 text-sm">{room.description}</p>
                      </div>

                      {room.facilities.length > 0 && (
                        <div>
                          <span className="block text-sm font-medium text-gray-700 mb-2">Facilities</span>
                          <div className="flex flex-wrap gap-2">
                            {room.facilities.map((facility, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                              >
                                {facility}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6 flex space-x-3">
                      <Link
                        to={`/rooms/${room._id}`}
                        className="btn-secondary"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDeleteRoom(room._id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminRooms;