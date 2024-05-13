const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); 
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('connected to atlas'))
  .catch(err => console.error('error connecting to atlas:', err));

const linkSchema = new mongoose.Schema({
  title: String,
  url: String,
  type: String, 
  tags: [String],
  author: String,
  date: { type: Date, default: Date.now },
  duration: Number 
});

const Link = mongoose.model('Link', linkSchema);

app.use(express.json());
app.use(cors());


app.post('/links', async (req, res) => {
  try {
    const { title, url, type, tags, author, duration } = req.body;
    const newLink = new Link({ title, url, type, tags, author });

    if (type === 'videos') {
      newLink.duration = duration;
    }

    await newLink.save();
    res.status(201).json(newLink);
  } catch (err) {
    console.error('error adding link:', err);
    res.status(500).json({ error: 'failed to add link' });
  }
});

// app.delete('/links/:linkId', async (req, res) => {
//   try {
//     const linkId = req.params.linkId;
//     const deletedLink = await Link.findByIdAndDelete(linkId);

//     if (!deletedLink) {
//       return res.status(404).json({ error: 'Link not found' });
//     }

//     res.json(deletedLink);
//   } catch (error) {
//     console.error('Error deleting link:', error);
//     res.status(500).json({ error: 'Failed to delete link' });
//   }
// });

app.get('/links', async (req, res) => {
  try {
    const links = await Link.find(); 
    res.json(links);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

app.listen(PORT, () => {
  console.log(`toolong microservice running on port ${PORT}`);
});
