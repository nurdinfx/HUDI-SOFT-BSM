const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const dotenv = require('dotenv');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

// Route files
const auth = require('./routes/auth');
const branches = require('./routes/branches');
const products = require('./routes/products');
const categories = require('./routes/categories');
const sales = require('./routes/sales');
const customers = require('./routes/customers');
const suppliers = require('./routes/suppliers');
const purchases = require('./routes/purchases');
const expenses = require('./routes/expenses');
const staff = require('./routes/staff');
const reports = require('./routes/reports');
const users = require('./routes/users');
const settings = require('./routes/settings');
const audit = require('./routes/audit');
const inventory = require('./routes/inventory');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);
const io = socketio(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Make io accessible to our routers
app.set('io', io);

// Socket.IO Connection
io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('joinBranch', (branchId) => {
        socket.join(branchId);
        console.log(`Socket ${socket.id} joined branch: ${branchId}`);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Set security headers
app.use(helmet());

// Dev logging middleware
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/auth', auth);
app.use('/api/v1/branches', branches);
app.use('/api/v1/products', products);
app.use('/api/v1/categories', categories);
app.use('/api/v1/sales', sales);
app.use('/api/v1/customers', customers);
app.use('/api/v1/suppliers', suppliers);
app.use('/api/v1/purchases', purchases);
app.use('/api/v1/expenses', expenses);
app.use('/api/v1/staff', staff);
app.use('/api/v1/reports', reports);
app.use('/api/v1/users', users);
app.use('/api/v1/settings', settings);
app.use('/api/v1/audit', audit);
app.use('/api/v1/inventory', inventory);

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Enterprise Retail API' });
});

// Use error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    // Close server & exit process
    server.close(() => process.exit(1));
});
