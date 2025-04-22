const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const app = express();

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

//Setup multer storage(in memory for now)
const storage = multer.memoryStorage();
const upload = multer({ storage });

app.get('/', (req, res) => {
	res.send('AutoLabelr backend is running');
});

app.post('/generate-labels', upload.single('file'), async (req, res) => {
	const { text } = req.body;
	const uploadedFile = req.file;

	if (!text && !uploadedFile) {
		return res
			.status(400)
			.json({ error: 'Either text or file is required' });
	}

	// Mock logic: respond with dummy labels + file info (if any)
	const dummyLabels = ['tagged', 'example', 'demo'];
	const fileInfo = uploadedFile
		? {
				originalname: uploadedFile.originalname,
				mimetype: uploadedFile.mimetype,
		  }
		: null;

	res.json({ labels: dummyLabels, fileInfo });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
