import mongoose from 'mongoose';
import { User } from './model.js';

async function seedUsers() {
    try {
        // Connect to database
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/surfturf');
        
        // Clear existing users
        await User.deleteMany({});
        console.log('Cleared existing users');
        
        // Create admin user
        const adminUser = new User({
            username: 'admin',
            password: 'admin123', // Plain text for simplicity - in production, hash this
            email: 'admin@surfturf.com',
            phone: '9876543210',
            role: 'admin'
        });
        
        // Create turf owner user
        const ownerUser = new User({
            username: 'turfowner',
            password: 'owner123', // Plain text for simplicity - in production, hash this
            email: 'owner@surfturf.com',
            phone: '9876543211',
            role: 'owner'
        });
        
        // Create a regular user for testing
        const regularUser = new User({
            username: 'customer',
            password: 'customer123', // Plain text for simplicity - in production, hash this
            email: 'customer@surfturf.com',
            phone: '9876543212',
            role: 'user'
        });
        
        // Save users
        await adminUser.save();
        await ownerUser.save();
        await regularUser.save();
        
        console.log('✅ Users seeded successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('🔑 Admin:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('   Email: admin@surfturf.com');
        console.log('\n🏢 Turf Owner:');
        console.log('   Username: turfowner');
        console.log('   Password: owner123');
        console.log('   Email: owner@surfturf.com');
        console.log('\n👤 Customer:');
        console.log('   Username: customer');
        console.log('   Password: customer123');
        console.log('   Email: customer@surfturf.com');
        
        // Close connection
        await mongoose.connection.close();
        console.log('\n✅ Database connection closed');
        
    } catch (error) {
        console.error('❌ Error seeding users:', error);
        process.exit(1);
    }
}

// Run the seeding function
seedUsers();
