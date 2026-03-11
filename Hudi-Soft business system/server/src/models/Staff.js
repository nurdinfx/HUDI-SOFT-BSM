const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    employeeId: {
        type: String,
        required: true,
        unique: true
    },
    designation: String,
    salary: {
        type: Number,
        required: true
    },
    joiningDate: Date,
    documents: [String],
    emergencyContact: {
        name: String,
        phone: String,
        relationship: String
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Staff', staffSchema);
