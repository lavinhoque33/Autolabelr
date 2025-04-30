const express = require('express');
const router = express.Router();
const esClient = require('../services/elasticClient');

router.get('/search', async (req, res) => {
	const query = req.query.q;
	if (!query) return res.status(400).json({ error: 'Missing query' });

	try {
		const results = await esClient.search({
			index: 'autolabelr',
			query: {
				multi_match: {
					query,
					fields: ['text', 'labels'],
				},
			},
		});

		const hits = results.hits.hits.map((hit) => hit._source);
		res.json({ results: hits });
	} catch (err) {
		console.error('Search error:', err);
		res.status(500).json({ error: 'Search failed' });
	}
});

module.exports = router;
