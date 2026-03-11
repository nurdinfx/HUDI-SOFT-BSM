const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');
const Branch = require('./src/models/Branch');
const bcrypt = require('bcryptjs');

dotenv.config();

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ MongoDB Connected');
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

const seedAdmin = async () => {
    await connectDB();
    try {
        await User.deleteMany({ email: 'admin@hudi-soft.com' });

        let branch = await Branch.findOne();
        if (!branch) {
            branch = await Branch.create({
                name: 'Main Branch',
                location: 'Downtown',
                address: '123 Main St, Central City',
                contactNumber: '123-456-7890',
                email: 'main@hudi-soft.com',
                isActive: true
            });
        }

        const admin = await User.create({
            name: 'Super Admin',
            email: 'admin@hudi-soft.com',
            password: 'password123',
            role: 'SUPER_ADMIN',
            branch: branch._id
        });

        console.log('Admin user created successfully:');
        console.log('Email: admin@hudi-soft.com');
        console.log('Password: password123');
        process.exit();
    } catch (error) {
        console.error('Error seeding admin:', error);
        process.exit(1);
    }
};

seedAdmin();
