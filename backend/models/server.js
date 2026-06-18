const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MOCK LOCAL DATABASE ARRAYS (Zero connectivity crashes setup checked)
let localInMemoryDatabase = [];

// API: Get Live Telemetry Grid Logs
app.get('/api/grievances', (req, res) => {
    res.json(localInMemoryDatabase);
});

// API: Post Submission Request Pipeline (Cleaned data handler mapping)
app.post('/api/grievances', (req, res) => {
    const uniqueBackendId = Date.now().toString(); // Creates fallback ID for matching index reference
    const newGrievance = { 
        id: uniqueBackendId,
        _id: uniqueBackendId, // Added dual indexing method to completely stop frontend routing errors
        ...req.body 
    };
    localInMemoryDatabase.unshift(newGrievance); 
    res.status(201).json(newGrievance);
});

// API: Toggle Status Put Config Method
app.put('/api/grievances/:id', (req, res) => {
    const { id } = req.params;
    // Cross match tracking codes check loop
    let item = localInMemoryDatabase.find(c => c.id === id || c._id === id || c.trackingId === id);
    
    if (!item) return res.status(404).json({ error: 'Record reference mismatch in grid' });
    
    item.status = (item.status === "Pending Investigation") ? "Resolved & Closed ✅" : "Pending Investigation";
    res.json(item);
});

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`🚀 NextGen Smart Server running smoothly on port ${PORT}`);
    console.log(`💡 Local Data Layer Connected! Ready for submission packets.`);
});