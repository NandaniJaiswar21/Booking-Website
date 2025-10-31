import { useState } from 'react'

const Reviews = () => {
  const [reviews] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      rating: 5,
      comment: 'Excellent service! The conference room was perfect for our team meeting. QR code check-in made everything so smooth.',
      date: '2024-01-15',
      room: 'Conference Room A'
    },
    {
      id: 2,
      name: 'Priya Sharma',
      rating: 4,
      comment: 'Great meeting rooms with all necessary facilities. The booking process was straightforward and the support team was helpful.',
      date: '2024-01-12',
      room: 'Meeting Room B'
    },
    {
      id: 3,
      name: 'Amit Patel',
      rating: 5,
      comment: 'Best booking experience ever! The interview room was exactly as described and the price was very reasonable.',
      date: '2024-01-10',
      room: 'Interview Room 1'
    },
    {
      id: 4,
      name: 'Sneha Reddy',
      rating: 4,
      comment: 'Very convenient booking system. The room was clean and well-maintained. Will definitely book again!',
      date: '2024-01-08',
      room: 'Conference Room B'
    }
  ])

  const [newReview, setNewReview] = useState({
    name: '',
    rating: 5,
    comment: '',
    room: ''
  })

  const handleSubmitReview = (e) => {
    e.preventDefault()
    // In a real app, this would send the review to the backend
    alert('Thank you for your review! It would be processed and displayed soon.')
    setNewReview({
      name: '',
      rating: 5,
      comment: '',
      room: ''
    })
  }

  const handleChange = (e) => {
    setNewReview({
      ...newReview,
      [e.target.name]: e.target.value
    })
  }

  const renderStars = (rating) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Customer Reviews</h1>
          <p className="text-xl text-gray-600">
            See what our customers are saying about their experience
          </p>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {reviews.map((review) => (
            <div key={review.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="font-semibold text-gray-900">{review.name}</h3>
                  <p className="text-sm text-gray-600">{review.room}</p>
                </div>
                <div className="text-right">
                  {renderStars(review.rating)}
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>

        {/* Add Review Form */}
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Experience</h2>
          
          <form onSubmit={handleSubmitReview} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={newReview.name}
                  onChange={handleChange}
                  required
                  className="input-field"
                  placeholder="Enter your name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Room Type
                </label>
                <select
                  name="room"
                  value={newReview.room}
                  onChange={handleChange}
                  required
                  className="input-field"
                >
                  <option value="">Select a room type</option>
                  <option value="Meeting Room">Meeting Room</option>
                  <option value="Conference Room">Conference Room</option>
                  <option value="Interview Room">Interview Room</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating
              </label>
              <select
                name="rating"
                value={newReview.rating}
                onChange={handleChange}
                className="input-field"
              >
                <option value="5">5 Stars - Excellent</option>
                <option value="4">4 Stars - Very Good</option>
                <option value="3">3 Stars - Good</option>
                <option value="2">2 Stars - Fair</option>
                <option value="1">1 Star - Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Review
              </label>
              <textarea
                name="comment"
                value={newReview.comment}
                onChange={handleChange}
                required
                rows="4"
                className="input-field"
                placeholder="Share your experience with the room and booking process..."
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full md:w-auto px-8"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Reviews