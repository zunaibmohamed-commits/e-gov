const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose'); // 🔌 MongoDB core engine lines inject seiyapadhugu

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));
// 🌟 இந்த லைனை அப்படியே காப்பி பண்ணி போடுங்க (கடைசியில் எந்த எக்ஸ்ட்ரா பிராக்கெட்டும் இல்லை)
const MONGO_URI = "mongodb+srv://panchayatAdmin:panchayatAdmin07@cluster0.htdkn.mongodb.net/panchayatDB?retryWrites=true&w=majority";


mongoose.connect(MONGO_URI)
  .then(() => console.log("🛰️ Data Cluster Connection Online [MongoDB Connected Successfully]"))
  .catch(err => console.error("🚨 Cloud Cluster Pipeline Offline Error:", err));

// 🧱 Creating MongoDB Data Schema Layout Document
const GrievanceSchema = new mongoose.Schema({
    district: { type: String, required: true },
    block: { type: String, required: true },
    village: { type: String, required: true },
    name: { type: String, default: "Anonymous Citizen" },
    text: { type: String, required: true },
    category: { type: String, default: "General" },
    attachedGraphic: { type: String, default: "" },
    trackingId: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    status: { type: String, default: "Pending Investigation ⏳" }
});

const Grievance = mongoose.model('Grievance', GrievanceSchema);

// 1. Backend ஃபோல்டர்க்குள்ள இருக்குற index.html-ஐ ஆட்டோமேட்டிக்கா லோடு பண்ண வைக்கிறது
app.use(express.static(path.join(__dirname)));

// 2. API Routes (Database links updated)
app.get('/api/grievances', async (req, res) => {
    try {
        const historyLogs = await Grievance.find().sort({ timestamp: -1 });
        res.json(historyLogs);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch cluster ledger records" });
    }
});

app.post('/api/grievances', async (req, res) => {
    try {
        const backendId = Date.now().toString();
        // Frontend anupura details kooda database payload parameters dynamic map aydum
        const payloadPacket = {
            ...req.body,
            trackingId: req.body.trackingId || "REG-" + Math.floor(100000 + Math.random() * 900000)
        };
        const newRecord = new Grievance(payloadPacket);
        const savedRecord = await newRecord.save();
        res.status(201).json(savedRecord);
    } catch (err) {
        res.status(500).json({ error: "Failed to ingest data log to cluster matrix", details: err.message });
    }
});

app.put('/api/grievances/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let item = await Grievance.findOne({ $or: [{ id: id }, { _id: id }, { trackingId: id }] });
        if (!item) return res.status(404).json({ error: 'Not found' });
        
        item.status = (item.status.includes("Pending")) ? "Resolved & Closed ✅" : "Pending Investigation ⏳";
        await item.save();
        res.json(item);
    } catch (err) {
        res.status(500).json({ error: "Status update sync failed" });
    }
});

// 3. ஹோம் பேஜ் லோடு ஆகும்போது index.html ஃபைலை அனுப்பும் முக்கியமான லைன்!
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 Master Package Bundle Active on Port ${PORT}!`);
    console.log(`🌐 Open this URL: http://localhost:5000`);
});