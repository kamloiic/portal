const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 4000;
const TOOLONG_API_URL = 'http://localhost:3000/links'; 

app.use(cors());
app.use(express.static('public'));

app.get('/recent-links', async (req, res) => {
  try {
    const response = await fetch(TOOLONG_API_URL);
    const links = await response.json();
    const recentLinks = links.slice(0, 5); 
    res.json(recentLinks);
  } catch (error) {
    console.error('Error fetching recent links:', error);
    res.status(500).json({ error: 'Failed to fetch recent links' });
  }
});

app.listen(PORT, () => {
  console.log(`UI frontend running on port ${PORT}`);
});
