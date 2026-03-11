const Staff = require('../models/Staff');
const User = require('../models/User');
const mongoose = require('mongoose');

// @desc    Add new staff member
// @route   POST /api/v1/staff
// @access  Private (Manager / Super Admin)
exports.addStaff = async (req, res, next) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { name, email, role, password, salary, phone, branch, designation } = req.body;

        // 1. Create User account first
        const user = await User.create([{
            name,
            email,
            password: password || 'Hudi123!', // Default password
            role: role || 'CASHIER',
            branch: branch || req.user.branch
        }], { session });

        // 2. Generate Employee ID (e.g. EMP-1710123456)
        const employeeId = `EMP-${Date.now().toString().slice(-6)}`;

        // 3. Create Staff profile
        const staff = await Staff.create([{
            user: user[0]._id,
            employeeId,
            designation: designation || role,
            salary: parseFloat(salary) || 0,
            joiningDate: new Date(),
            phone // If you add this to the model or handle it via designation
        }], { session });

        await session.commitTransaction();
        session.endSession();

        // Return the staff record with populated user
        const populatedStaff = await Staff.findById(staff[0]._id).populate('user', 'name email role branch');

        res.status(201).json({ success: true, data: populatedStaff });
    } catch (err) {
        await session.abortTransaction();
        session.endSession();
        next(err);
    }
};

// @desc    Get all staff
// @route   GET /api/v1/staff
// @access  Private
exports.getStaffList = async (req, res, next) => {
    try {
        let query = {};
        if (req.user.role !== 'SUPER_ADMIN') {
            query.branch = req.user.branch;
        }
        
        // Find staff members where the user belongs to the branch
        const staff = await Staff.find().populate({
            path: 'user',
            select: 'name email role branch',
            match: query
        });

        // Filter out staff if population match failed (e.g. wrong branch)
        const visibleStaff = staff.filter(s => s.user !== null);

        res.status(200).json({ success: true, count: visibleStaff.length, data: visibleStaff });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single staff member
// @route   GET /api/v1/staff/:id
// @access  Private
exports.getStaffMember = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id).populate('user', 'name email role');
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }
        res.status(200).json({ success: true, data: staff });
    } catch (err) {
        next(err);
    }
};

// @desc    Update staff member
// @route   PUT /api/v1/staff/:id
// @access  Private (Manager / Super Admin)
exports.updateStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }).populate('user', 'name email role');

        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }
        res.status(200).json({ success: true, data: staff });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete staff member
// @route   DELETE /api/v1/staff/:id
// @access  Private (Manager / Super Admin)
exports.deleteStaff = async (req, res, next) => {
    try {
        const staff = await Staff.findById(req.params.id);
        if (!staff) {
            return res.status(404).json({ success: false, message: 'Staff member not found' });
        }
        
        const userId = staff.user;
        await staff.deleteOne();
        
        // Also delete the user account
        if (userId) {
            await User.findByIdAndDelete(userId);
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
