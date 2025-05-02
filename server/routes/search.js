const express = require('express');
const router = express.Router();
const esClient = require('../services/elasticClient');

router.get('/search', async (req, res) => {
	const query = req.query.q;
	const strict = req.query.strict === 'true'; // expects "?strict=true"
	const page = parseInt(req.query.page) || 1;
	const size = parseInt(req.query.size) || 10;
	const from = (page - 1) * size;

	if (!query) return res.status(400).json({ error: 'Missing query' });

	try {
		const useFuzzy = !strict && query.length > 2;

		const results = await esClient.search({
			index: 'autolabelr',
			from,
			size,
			query: {
				bool: {
					should: [
						{
							match: {
								text: useFuzzy
									? { query, fuzziness: 'AUTO' }
									: { query },
							},
						},
						{
							match: {
								labels: useFuzzy
									? { query, fuzziness: 'AUTO' }
									: { query },
							},
						},
					],
					minimum_should_match: 1,
				},
			},
			highlight: {
				pre_tags: ['<mark>'],
				post_tags: ['</mark>'],
				fields: {
					text: {},
					labels: {},
				},
			},
		});

		const hits = results.hits.hits.map((hit) => ({
			...hit._source,
			highlights: hit.highlight || {},
		}));
		res.json({
			results: hits,
			total: results.hits.total.value,
			page,
			size,
		});
	} catch (err) {
		console.error('Search error:', err);
		res.status(500).json({ error: 'Search failed' });
	}
});

module.exports = router;
