const axios = require('axios');

const generateLabelsFromLLM = async (text) => {
	const res = await axios.post('http://localhost:8000/generate', { text });
	return res.data.labels_raw || '';
};

module.exports = generateLabelsFromLLM;
