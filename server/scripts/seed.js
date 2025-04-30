const { faker } = require('@faker-js/faker');
const esClient = require('../services/elasticClient');

const indexName = 'autolabelr';

const labelsPool = [
	'bug',
	'feature',
	'react',
	'javascript',
	'performance',
	'async',
	'backend',
	'frontend',
	'database',
	'security',
];

const generateEntry = () => {
	const randomText = faker.lorem.paragraphs(2);
	const randomLabels = faker.helpers.arrayElements(
		labelsPool,
		faker.number.int({ min: 2, max: 5 }),
	);

	return [
		{ index: { _index: indexName } },
		{
			text: randomText,
			labels: randomLabels,
			createdAt: new Date(),
			fileInfo: null,
		},
	];
};

const seed = async () => {
	console.log(`📥 Seeding Elasticsearch index: ${indexName}`);

	try {
		const bulkOps = [];

		for (let i = 0; i < 20; i++) {
			const [meta, doc] = generateEntry();
			bulkOps.push(meta, doc);
		}

		const result = await esClient.bulk({ body: bulkOps });

		if (result.errors) {
			console.error('❌ Some documents failed to index', result);
		} else {
			console.log(
				`✅ Successfully indexed ${bulkOps.length / 2} documents`,
			);
		}

		process.exit(0);
	} catch (err) {
		console.error('Error during seeding:', err.message || err);
		process.exit(1);
	}
};

seed();
