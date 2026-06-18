const mongoose = require('mongoose');

const GrievanceSchema = new mongoose.Schema({
    trackingId: { type: String, required: true, unique: true },
    timestamp: { type: String, required: true },
    district: { type: String, required: true },
    block: { type: String, required: true },
    village: { type: String, required: true },
    ward: { type: String, required: true },
    name: { type: String, default: "Anonymous Citizen" },
    text: { type: String, required: true },
    gps: { type: String, required: true },
    image: { type: String }, // Base64 string image path conversion storage
    category: { type: String, required: true },
    priority: { type: String, required: true },
    badgeClass: { type: String, required: true },
    status: { type: String, default: "Pending Investigation" }
});

module.exports = mongoose.model('Grievance', GrievanceSchema);
