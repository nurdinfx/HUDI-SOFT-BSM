const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./src/models/User');

dotenv.config();

const test = async () => {
    try {
        const candidateUri = 'mongodb+srv://nuurdiinxaliimo_db_user:ZvtedSKNzWxFwFPw@hudisoft.4qnmrtu.mongodb.net/EnterpriseRetail?appName=HudiSoft';
        console.log('Testing with CANDIDATE URI...');
        await mongoose.connect(candidateUri, { serverSelectionTimeoutMS: 5000 });
        console.log('Connected with CANDIDATE URI!');

        const userCount = await User.countDocuments();
        console.log('Total users:', userCount);

        const testUser = await User.findOne();
        console.log('Sample user found:', testUser ? testUser.email : 'None');

        process.exit(0);
    } catch (err) {
        console.error('Diagnostic error:', err);
        process.exit(1);
    }
};

test();
