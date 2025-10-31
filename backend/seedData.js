import mongoose from 'mongoose';
import Room from './models/Room.js';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleRooms = [
  {
    name: 'Conference Room A',
    type: 'Conference',
    capacity: 20,
    location: 'Mumbai - Andheri East',
    description: 'Spacious conference room with modern audio-visual equipment, perfect for large team meetings and client presentations. Features comfortable seating and excellent acoustics.',
    facilities: ['Projector', 'Whiteboard', 'AC', 'Video Conferencing', 'WiFi', 'Sound System'],
    pricePerHour: 1500,
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=600&h=400&fit=crop'
    ]
  },
  {
    name: 'Meeting Room B',
    type: 'Meeting',
    capacity: 8,
    location: 'Mumbai - Bandra West',
    description: 'Cozy meeting room ideal for small team discussions and brainstorming sessions. Perfect for collaborative work in a quiet environment.',
    facilities: ['TV Screen', 'Whiteboard', 'AC', 'WiFi', 'Coffee Machine'],
    pricePerHour: 800,
    images: [
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1558618666-fcd25856cd61?w=600&h=400&fit=crop'
    ]
  },
  {
    name: 'Interview Room 1',
    type: 'Interview',
    capacity: 4,
    location: 'Mumbai - Lower Parel',
    description: 'Private and professional space designed specifically for interviews and one-on-one meetings. Ensures complete privacy and comfort.',
    facilities: ['AC', 'WiFi', 'Recording Equipment', 'Whiteboard'],
    pricePerHour: 500,
    images: [
      'https://images.unsplash.com/photo-1560448204-603b3fc33ddc?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop'
    ]
  },
  {
    name: 'Conference Room Premium',
    type: 'Conference',
    capacity: 30,
    location: 'Mumbai - Nariman Point',
    description: 'Premium conference room with state-of-the-art facilities and panoramic city views. Ideal for executive meetings and important client presentations.',
    facilities: ['Projector', 'Sound System', 'AC', 'Video Conferencing', 'WiFi', 'Catering', 'Whiteboard'],
    pricePerHour: 2500,
    images: [
      'https://images.unsplash.com/photo-1571624436279-b272aff752b5?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?w=600&h=400&fit=crop'
    ]
  },
  {
    name: 'Creative Studio',
    type: 'Meeting',
    capacity: 12,
    location: 'Mumbai - Powai',
    description: 'Bright and inspiring creative studio with natural lighting. Perfect for design thinking sessions and creative workshops.',
    facilities: ['Whiteboard', 'AC', 'WiFi', 'Creative Tools', 'Natural Lighting'],
    pricePerHour: 1200,
    images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&h=400&fit=crop'
    ]
  }
];

const sampleAdmin = {
  name: 'Admin User',
  email: 'admin@roombook.com',
  password: 'admin123',
  mobileNumber: '+919876543210',
  role: 'admin',
  isVerified: true
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Room.deleteMany({});
    await User.deleteMany({ email: sampleAdmin.email });
    console.log('Cleared existing data');

    // Insert sample rooms
    await Room.insertMany(sampleRooms);
    console.log('Sample rooms inserted successfully');

    // Create admin user
    const adminUser = await User.create(sampleAdmin);
    console.log('Admin user created:', adminUser.email);

    console.log('Database seeded successfully!');
    console.log('Rooms now have proper images:');
    sampleRooms.forEach(room => {
      console.log(`- ${room.name}: ${room.images.length} images added`);
    });
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

