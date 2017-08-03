module.exports = {
	mapKeys(keyMapping, stack, opts) {
		opts = opts || {};
		const { stringify = false, allowMissing = false } = opts;
		let resource = {};
		for (const key of Object.keys(keyMapping)) {
			const value = typeof stack[key] === 'undefined' ? '' : stack[key];
			resource[keyMapping[key]] = stringify ? `${value}` : value;
		}
		return resource;
	},
};
