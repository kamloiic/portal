const express = require('express');
const mongoose = require('mongoose');
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

app.listen(PORT, () => {
  console.log(`toolong microservice running on port ${PORT}`);
});
