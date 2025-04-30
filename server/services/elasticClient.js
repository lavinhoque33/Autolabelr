const { Client } = require('@elastic/elasticsearch');

const esClient = new Client({
	node: process.env.ES_URL || 'http://localhost:9200',
});

module.exports = esClient;
