// Add these new Schemas for TN Geographical Hierarchy Map Data
const BlockSchema = new mongoose.Schema({
    name: String,
    villages: [String] // Array of all 12,525 villages split inside blocks
});

const DistrictGeoSchema = new mongoose.Schema({
    district: { type: String, unique: true },
    blocks: [BlockSchema]
});

const CountryGeo = mongoose.model('CountryGeo', DistrictGeoSchema);

// 🌐 API Endpoints to Fetch Real-time Dynamic Dropdowns data from database
app.get('/api/geo/districts', async (req, res) => {
    try {
        const districts = await CountryGeo.find({}).distinct('district');
        res.json(districts);
    } catch (err) { res.status(500).json({ error: "Districts loading failed" }); }
});

app.get('/api/geo/blocks/:district', async (req, res) => {
    try {
        const data = await CountryGeo.findOne({ district: req.params.district });
        if(!data) return res.json([]);
        const blocksList = data.blocks.map(b => b.name);
        res.json(blocksList);
    } catch (err) { res.status(500).json({ error: "Blocks fetch error" }); }
});

app.get('/api/geo/villages/:district/:block', async (req, res) => {
    try {
        const data = await CountryGeo.findOne({ district: req.params.district });
        if(!data) return res.json([]);
        const blockObj = data.blocks.find(b => b.name === req.params.block);
        res.json(blockObj ? blockObj.villages : []);
    } catch (err) { res.status(500).json({ error: "Villages fetch error" }); }
});