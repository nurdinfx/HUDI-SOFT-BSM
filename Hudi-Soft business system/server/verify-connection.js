const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const test = async () => {
    try {
        console.log('Testing final .env connection...');
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000
        });
        console.log('✅ Connection SUCCESSFUL!');

        const count = await User.countDocuments();
        console.log('Total users in DB:', count);

        process.exit(0);
    } catch (err) {
        console.error('❌ Connection FAILED:', err.message);
        console.error('IP Address:', require('child_process').execSync('curl -s ifconfig.me').toString().trim());
        process.exit(1);
    }
};

test();
