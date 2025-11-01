import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const AddRoom = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'Meeting',
    capacity: '',
    location: '',
    description: '',
    pricePerHour: '',
    facilities: []
  });
  const [newFacility, setNewFacility] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddFacility = () => {
    if (newFacility.trim() && !formData.facilities.includes(newFacility.trim())) {
      setFormData({
        ...formData,
        facilities: [...formData.facilities, newFacility.trim()]
      });
      setNewFacility('');
    }
  };

  const handleRemoveFacility = (facilityToRemove) => {
    setFormData({
      ...formData,
      facilities: formData.facilities.filter(facility => facility !== facilityToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('http://localhost:5000/api/admin/rooms', formData ,
        {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  }
}
      );
      alert('Room added successfully!');
      navigate('/rooms');
    } catch (error) {
      console.error('Error adding room:', error);
      alert(error.response?.data?.message || 'Failed to add room');
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p>Please login to access this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="card p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Add New Room</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Room Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Conference Room A"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type *
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="Meeting">Meeting Room</option>
                  <option value="Conference">Conference Room</option>
                  <option value="Interview">Interview Room</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="input-field"
                  placeholder="e.g., 10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="input-field"
                placeholder="e.g., Mumbai - Andheri East"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price Per Hour (₹) *
              </label>
              <input
                type="number"
                name="pricePerHour"
                value={formData.pricePerHour}
                onChange={handleChange}
                required
                min="0"
                step="50"
                className="input-field"
                placeholder="e.g., 1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows="4"
                className="input-field"
                placeholder="Describe the room features, ambiance, and special characteristics..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Facilities
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newFacility}
                  onChange={(e) => setNewFacility(e.target.value)}
                  className="input-field flex-1"
                  placeholder="e.g., Projector, Whiteboard, AC"
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFacility())}
                />
                <button
                  type="button"
                  onClick={handleAddFacility}
                  className="btn-primary whitespace-nowrap"
                >
                  Add
                </button>
              </div>
              
              {formData.facilities.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.facilities.map((facility, index) => (
                    <span
                      key={index}
                      className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
                    >
                      {facility}
                      <button
                        type="button"
                        onClick={() => handleRemoveFacility(facility)}
                        className="text-primary-600 hover:text-primary-800"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Adding Room...' : 'Add Room'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/rooms')}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRoom;