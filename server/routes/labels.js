const express = require('express');
const router = express.Router();
const path = require('path');
const upload = require('../middleware/upload');
const esClient = require('../services/elasticClient');
const generateLabelsFromLLM = require('../services/inferenceClient');
const parseLabels = require('../utils/parseLabels');

router.post('/generate-labels', upload.single('file'), async (req, res) => {
	const { text } = req.body;
	const uploadedFile = req.file;

	if (!text && !uploadedFile) {
		return res
			.status(400)
			.json({ error: 'Either text or file is required' });
	}

	let finalText = text || '';

	if (uploadedFile) {
		const ext = path.extname(uploadedFile.originalname).toLowerCase();
		if (ext === '.txt' || ext === '.md') {
			finalText = uploadedFile.buffer.toString('utf-8');
		} else {
			return res
				.status(501)
				.json({ error: 'Only .txt/.md supported for now' });
		}
	}

	try {
		const rawOutput = await generateLabelsFromLLM(finalText);
		const labels = parseLabels(rawOutput);

		// Index in Elasticsearch
		await esClient.index({
			index: 'autolabelr',
			document: {
				text: finalText,
				labels,
				createdAt: new Date(),
				fileInfo: uploadedFile
					? {
							name: uploadedFile.originalname,
							type: uploadedFile.mimetype,
					  }
					: null,
			},
		});

		res.json({ labels, extractedText: finalText.slice(0, 100) + '...' });
	} catch (err) {
		console.error('Label generation failed:', err);
		res.status(500).json({ error: 'Failed to generate labels' });
	}
});

module.exports = router;
