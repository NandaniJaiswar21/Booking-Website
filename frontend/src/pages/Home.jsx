import { Link } from 'react-router-dom'
import ChatBot from '../components/Chatbot.jsx'

const Home = () => {
  const features = [
    {
      title: 'Easy Booking',
      description: 'Book meeting rooms in just a few clicks with our intuitive booking system.',
      icon: '📅'
    },
    {
      title: 'Multiple Room Types',
      description: 'Choose from meeting rooms, conference halls, and interview rooms.',
      icon: '🏢'
    },
    {
      title: 'QR Check-in',
      description: 'Seamless check-in experience with QR codes sent to your email.',
      icon: '📱'
    },
    {
      title: 'Live Support',
      description: '24/7 customer support and AI chatbot for instant assistance.',
      icon: '💬'
    }
  ]

  const stats = [
    { number: '500+', label: 'Rooms Available' },
    { number: '10K+', label: 'Happy Customers' },
    { number: '50+', label: 'Locations' },
    { number: '98%', label: 'Satisfaction Rate' }
  ]

  return (
    <div>
      {/* Hero Section with Background Image */}
      <section 
        className="relative bg-gradient-to-r from-blue-900/80 to-indigo-900/80 text-white min-h-screen flex items-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366754035-f200968a6e72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundBlendMode: 'overlay'
        }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Book Your Perfect
              <span className="block text-blue-200">Meeting Space</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Modern meeting rooms, competitive prices, and seamless booking experience for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/rooms" className="btn-primary bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                Browse Rooms
              </Link>
              <Link to="/register" className="btn-secondary border-2 border-white text-white hover:bg-white hover:text-blue-600 text-lg px-8 py-3 rounded-lg font-semibold transition-all duration-300">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Subtle Background */}
      <section 
        className="py-20 bg-white relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1556761175-b413da4baf72?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        }}
      >
        <div className="absolute inset-0 bg-white/90"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose RoomBook?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We provide the best meeting room booking experience with cutting-edge features.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="text-center p-8 bg-white/80 backdrop-blur-sm rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-blue-200"
              >
                <div className="text-5xl mb-6">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section with Modern Background */}
      <section 
        className="py-20 relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2069&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-blue-900/80"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="text-white">
                <div className="text-4xl md:text-5xl font-bold mb-3 text-blue-200">
                  {stat.number}
                </div>
                <div className="text-blue-100 font-medium text-lg">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with Professional Background */}
      <section 
        className="py-20 text-white relative"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1568992688061-936dea28d8a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="absolute inset-0 bg-indigo-900/80"></div>
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Book Your Next Meeting?
          </h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust RoomBook for their meeting space needs.
          </p>
          <Link 
            to="/register" 
            className="inline-block bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Create Account
          </Link>
        </div>
      </section>

      <ChatBot />
    </div>
  )
}

export default Home