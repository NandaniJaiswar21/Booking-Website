import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const RoomDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [room, setRoom] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  useEffect(() => {
    fetchRoom();
    fetchReviews();
  }, [id]);

  const fetchRoom = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
      setRoom(response.data);
    } catch (error) {
      console.error('Error fetching room:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/reviews/room/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading room details...</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Room not found</h2>
          <Link to="/rooms" className="btn-primary">
            Back to Rooms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="card overflow-hidden">
              {/* Room Image */}
              <div className="h-64 bg-gray-200 flex items-center justify-center">
                {room.images && room.images.length > 0 ? (
                  <img
                    src={room.images[0]}
                    alt={room.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="text-6xl mb-2">🏢</div>
                    <div className="text-xl">No Image Available</div>
                  </div>
                )}
              </div>

              <div className="p-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{room.name}</h1>
                    <div className="flex items-center space-x-4 text-gray-600">
                      <span className="flex items-center">
                        📍 {room.location}
                      </span>
                      <span className="flex items-center">
                        👥 Capacity: {room.capacity} people
                      </span>
                      <span className="bg-primary-100 text-primary-800 font-medium px-3 py-1 rounded-full">
                        {room.type}
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 md:mt-0 text-right">
                    <div className="text-3xl font-bold text-primary-600">
                      ₹{room.pricePerHour}/hour
                    </div>
                    <div className="text-sm text-gray-600">per hour</div>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-700 leading-relaxed">{room.description}</p>
                </div>

                {/* Facilities */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Facilities</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {room.facilities.map((facility, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                        <span className="text-gray-700">{facility}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Booking CTA */}
                <div className="bg-gray-50 rounded-lg p-6 border">
                  <h3 className="text-lg font-semibold mb-4">Ready to book this room?</h3>
                  <p className="text-gray-600 mb-4">
                    Check availability and book this {room.type.toLowerCase()} for your next meeting.
                  </p>
                  {user ? (
                    <Link
                      to={`/booking/${room._id}`}
                      className="btn-primary text-lg px-8 py-3"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <Link
                      to="/login"
                      className="btn-primary text-lg px-8 py-3"
                    >
                      Login to Book
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="card p-8 mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reviews</h2>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary-600">{averageRating}</div>
                  <div className="text-sm text-gray-600">
                    {reviews.length} review{reviews.length !== 1 ? 's' : ''}
                  </div>
                </div>
              </div>

              {user && (
                <Link
                  to={`/write-review/${room._id}`}
                  className="btn-primary mb-6 inline-block"
                >
                  Write a Review
                </Link>
              )}

              {reviewsLoading ? (
                <div className="text-center py-8">Loading reviews...</div>
              ) : reviews.length > 0 ? (
                <div className="space-y-6">
                  {reviews.map((review) => (
                    <div key={review._id} className="border-b pb-6 last:border-b-0">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{review.user.name}</h4>
                          <div className="flex items-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                              <span
                                key={i}
                                className={`text-lg ${
                                  i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <span className="text-sm text-gray-500">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-gray-700">{review.comment}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No reviews yet. Be the first to review this room!
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="card p-6">
              <h3 className="font-semibold mb-4">Quick Info</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{room.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Capacity:</span>
                  <span className="font-medium">{room.capacity} people</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Price:</span>
                  <span className="font-medium">₹{room.pricePerHour}/hour</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Location:</span>
                  <span className="font-medium text-right">{room.location}</span>
                </div>
              </div>
            </div>

            {/* Admin Actions */}
            {user && (
              <div className="card p-6">
                <h3 className="font-semibold mb-4">Admin Actions</h3>
                <Link
                  to="/add-room"
                  className="btn-primary w-full text-center block mb-3"
                >
                  Add New Room
                </Link>
                <button className="btn-secondary w-full">
                  Manage Rooms
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetails;