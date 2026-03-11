const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const testLogin = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        const email = 'admin@hudi-soft.com';
        const password = 'password123';

        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log('User not found');
            process.exit(1);
        }

        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match:', isMatch);
        console.log('Hash in DB:', user.password);

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testLogin();
