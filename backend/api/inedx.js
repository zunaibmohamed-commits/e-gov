const express = require('express');
const cors = require('cors');
const path = require('path'); // Path டூல் முக்கியம்!

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// 1. Backend ஃபோல்டர்க்குள்ள இருக்குற index.html-ஐ ஆட்டோமேட்டிக்கா லோடு பண்ண வைக்கிறது
app.use(express.static(path.join(__dirname)));

let localInMemoryDatabase = [];

// 2. API Routes
app.get('/api/grievances', (req, res) => {
    res.json(localInMemoryDatabase);
});

app.post('/api/grievances', (req, res) => {
    const backendId = Date.now().toString();
    const newGrievance = { id: backendId, _id: backendId, ...req.body };
    localInMemoryDatabase.unshift(newGrievance); 
    res.status(201).json(newGrievance);
});

app.put('/api/grievances/:id', (req, res) => {
    const { id } = req.params;
    let item = localInMemoryDatabase.find(c => c.id === id || c._id === id || c.trackingId === id);
    if (!item) return res.status(404).json({ error: 'Not found' });
    item.status = (item.status === "Pending Investigation") ? "Resolved & Closed ✅" : "Pending Investigation";
    res.json(item);
});

// 3. ஹோம் பேஜ் லோடு ஆகும்போது index.html ஃபைலை அனுப்பும் முக்கியமான லைன்!
app.get('/', (req, res) => {
    module.exports = app;
});

const PORT = 5000;
app.listen(PORT, () => {
    module.exports = app;
});