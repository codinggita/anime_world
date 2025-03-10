const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');
const app = express();
const port = 5000;

// MongoDB connection details
const uri = "mongodb+srv://Prem:Prem2007@cluster0.ewqmd.mongodb.net/";
const dbName = "animeworld";

// Middleware
app.use(express.json());
app.use(cors());

let db, anime;

// Connect to MongoDB and initialize collections
async function initializeDatabase() {
    try {
        const client = new MongoClient(uri, {
            useNewUrlParser: true,
            serverApi: { version: '1', strict: true, deprecationErrors: true }
        });

        await client.connect();
        console.log("Connected to MongoDB");

        db = client.db(dbName);
        anime = db.collection("anime");
    } catch (err) {
        console.error("MongoDB Connection Error:", err);
        process.exit(1);
    }
}

initializeDatabase();

// Anime Routes
app.get('/anime', async (req, res) => {
    try {
        const animes = await anime.find().toArray();
        res.json(animes);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.get('/anime/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const animee = await anime.findOne({ _id: new ObjectId(_id) });
        if (!animee) return res.status(404).json({ message: 'Anime not found' });
        res.json(animee);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.post('/anime', async (req, res) => {
    try {
        const { title, image, description } = req.body;
        const existingAnime = await anime.findOne({ title });
        if (existingAnime) return res.status(400).json({ message: 'Anime already exists' });

        const newAnime = { title, image, description };
        const result = await anime.insertOne(newAnime);
        res.status(201).json({ message: 'Anime added successfully', animeId: result.insertedId });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

app.delete('/anime/:id', async (req, res) => {
    try {
        const _id = req.params.id;
        const result = await anime.deleteOne({ _id: new ObjectId(_id) });
        if (result.deletedCount === 0) return res.status(404).json({ message: 'Anime not found' });
        res.json({ message: 'Anime deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// Start Server
app.listen(port, () => console.log(`✅ Server running on port: ${port}`));