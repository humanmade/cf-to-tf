module.exports = {
	clean(opts, hcl) {
		let output = hcl.split(/[\r\n]+/).reduce((sum, line) => {
			// removes empty lines
			if (line === '') return sum;

			const resource = /^"(resource)"\s"(.+)/;
			const quotes = /"(.+)" = (.+)/;
			const newLine = line
				.replace(resource, '$1 "$2')
				.replace(quotes, '$1 = $2');
			return sum + newLine + '\n';
		}, '');

		return Promise.resolve(output);
	},
};
