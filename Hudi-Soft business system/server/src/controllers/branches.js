const Branch = require('../models/Branch');

// @desc    Get all branches
// @route   GET /api/v1/branches
// @access  Private (Super Admin)
exports.getBranches = async (req, res, next) => {
    try {
        const branches = await Branch.find().populate('manager', 'name email');
        res.status(200).json({ success: true, count: branches.length, data: branches });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single branch
// @route   GET /api/v1/branches/:id
// @access  Private
exports.getBranch = async (req, res, next) => {
    try {
        const branch = await Branch.findById(req.params.id).populate('manager', 'name email');
        if (!branch) {
            return res.status(404).json({ success: false, message: 'Branch not found' });
        }
        res.status(200).json({ success: true, data: branch });
    } catch (err) {
        next(err);
    }
};

// @desc    Create branch
// @route   POST /api/v1/branches
// @access  Private (Super Admin)
exports.createBranch = async (req, res, next) => {
    try {
        const branch = await Branch.create(req.body);
        res.status(201).json({ success: true, data: branch });
    } catch (err) {
        next(err);
    }
};

// @desc    Update branch
// @route   PUT /api/v1/branches/:id
// @access  Private (Super Admin / Branch Manager)
exports.updateBranch = async (req, res, next) => {
    try {
        let branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ success: false, message: 'Branch not found' });
        }
        branch = await Branch.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });
        res.status(200).json({ success: true, data: branch });
    } catch (err) {
        next(err);
    }
};
// @desc    Delete branch
// @route   DELETE /api/v1/branches/:id
// @access  Private (Super Admin)
exports.deleteBranch = async (req, res, next) => {
    try {
        const branch = await Branch.findById(req.params.id);
        if (!branch) {
            return res.status(404).json({ success: false, message: 'Branch not found' });
        }
        await branch.deleteOne();
        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
