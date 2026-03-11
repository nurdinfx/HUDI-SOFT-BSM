const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const checkUser = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        const user = await User.findOne({ email: 'admin@hudi-soft.com' }).select('+password');
        if (user) {
            console.log('User found:', user.email);
            console.log('Role:', user.role);
            console.log('Branch:', user.branch);
            // We can't easily check the password here without bcrypt, but we can see if it exists
            console.log('Password hash exists:', !!user.password);
        } else {
            console.log('User NOT found!');
        }
        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkUser();
