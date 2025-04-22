const express = require('express');
const cors = require('cors');
const app = express();

require('dotenv').config();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('AutoLabelr backend is running');
});

app.post('/generate-labels', async (req, res) => {
  const { text } = req.body;

  // (Later) use DeepSeek model here
  if (!text || text.trim() === "") {
    return res.status(400).json({ error: "Text is required" });
  }

  // TEMPORARY MOCK: simulate DeepSeek response
  const dummyLabels = ["bug", "performance", "react"];

  res.json({ labels: dummyLabels });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

