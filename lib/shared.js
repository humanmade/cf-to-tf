module.exports = {
	mapKeys(keyMapping, stack, opts) {
		opts = opts || {};
		const { stringify = false, allowMissing = false } = opts;
		let resource = {};
		for (const stackKey of Object.keys(keyMapping)) {
			const property = keyMapping[stackKey];

			const required =
				typeof property.required === 'undefined' ? true : property.required;

			if (typeof stack[stackKey] === 'undefined' && !required) continue;

			const resourceKey =
				typeof property.name === 'undefined' ? property : property.name;

			const def =
				typeof property.default === 'undefined' ? '' : property.default;

			const value =
				typeof stack[stackKey] === 'undefined' ? def : stack[stackKey];

			resource[resourceKey] = stringify ? `${value}` : value;
		}
		return resource;
	},
};
