const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./src/models/Product');
const Branch = require('./src/models/Branch');
const Inventory = require('./src/models/Inventory');

dotenv.config();

const fixStock = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected.');

        const products = await Product.find();
        const branches = await Branch.find({ isActive: true });

        console.log(`Found ${products.length} products and ${branches.length} branches.`);

        let createdCount = 0;
        for (const product of products) {
            for (const branch of branches) {
                const existing = await Inventory.findOne({ product: product._id, branch: branch._id });
                if (!existing) {
                    await Inventory.create({
                        product: product._id,
                        branch: branch._id,
                        quantity: 10, // Default for fix
                        lowStockThreshold: 5
                    });
                    createdCount++;
                }
            }
        }

        console.log(`Job complete. Created ${createdCount} missing inventory records.`);
        process.exit(0);
    } catch (err) {
        console.error('Error during fix:', err);
        process.exit(1);
    }
};

fixStock();
