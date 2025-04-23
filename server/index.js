const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
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

	let finalText = text || '';

	// If it's a text file, extract content
	if (uploadedFile) {
		const fileExt = path.extname(uploadedFile.originalname).toLowerCase();

		if (fileExt === '.txt' || fileExt === '.md') {
			finalText = uploadedFile.buffer.toString('utf-8');
		} else if (
			fileExt === '.png' ||
			fileExt === '.jpg' ||
			fileExt === '.jpeg'
		) {
			// For now: simulate with dummy message
			return res
				.status(501)
				.json({ error: 'Image OCR not implemented yet' });
		} else {
			return res.status(400).json({ error: 'Unsupported file type' });
		}
	}

	const prompt = `Generate relevant tags or labels (in a comma-separated list) for the following text:\n\n${finalText}`;

	try {
		const deepseekRes = await axios.post(
			'https://deepseekcoder-6-7b-openai-compatible.hf.space/v1/chat/completions',
			{
				model: 'deepseek-coder-6.7b-instruct',
				messages: [
					{
						role: 'user',
						content: prompt,
					},
				],
			},
			{
				headers: {
					'Content-Type': 'application/json',
				},
			},
		);

		const rawOutput = deepseekRes.data.choices?.[0]?.message?.content || '';
		const extractedLabels = rawOutput
			.replace(/labels?:/i, '')
			.split(/,|\n/)
			.map((label) => label.trim().toLowerCase())
			.filter((label) => label.length > 0);

		res.json({
			labels: extractedLabels,
			extractedText: finalText.slice(0, 100) + '...',
		});
	} catch (error) {
		console.error(
			'DeepSeek error:',
			error?.response?.data || error.message,
		);
		res.status(500).json({
			error: 'Failed to generate labels using DeepSeek',
		});
	}
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
