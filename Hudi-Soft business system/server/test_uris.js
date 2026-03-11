const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const uris = [
    'mongodb+srv://Qz50haiGh2L5K6XG:Qz50haiGh2L5K6XG@hudisoft.4qnmrtu.mongodb.net/EnterpriseRetail?retryWrites=true&w=majority&appName=HudiSoft',
    'mongodb://Qz50haiGh2L5K6XG:Qz50haiGh2L5K6XG@ac-n6g3kx5-shard-00-00.4qnmrtu.mongodb.net:27017,ac-n6g3kx5-shard-00-01.4qnmrtu.mongodb.net:27017,ac-n6g3kx5-shard-00-02.4qnmrtu.mongodb.net:27017/EnterpriseRetail?ssl=true&replicaSet=atlas-14dgus-shard-0&authSource=admin&retryWrites=true&w=majority&appName=HudiSoft'
];

const test = async () => {
    for (const uri of uris) {
        try {
            console.log(`Testing URI: ${uri.substring(0, 30)}...`);
            await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
            console.log('✅ SUCCESS!');
            await mongoose.disconnect();
            process.exit(0);
        } catch (err) {
            console.error('❌ FAILED:', err.message);
        }
    }
    process.exit(1);
};

test();
