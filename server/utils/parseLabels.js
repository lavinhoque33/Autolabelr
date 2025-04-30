const parseLabels = (rawOutput) => {
	return rawOutput
		.replace(/labels?:/i, '')
		.split(/,|\n/)
		.map((label) => label.trim().toLowerCase())
		.filter(Boolean);
};

module.exports = parseLabels;
