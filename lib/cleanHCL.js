module.exports = {
	clean(opts, hcl) {
		let output = hcl.split(/[\r\n]+/).reduce((sum, line) => {
			// removes empty lines
			if (line === '') return sum;

			const resource = /^"(resource)"\s"(.+)/;
			const quotes = /"(.+)"( = .+)/;
			const requoteIllegal = /([a-zA-Z-_]+([:]).+)( = .+)/;
			let newLine = line
				.replace(resource, '$1 "$2')
				.replace(quotes, '$1$2')
				.replace(requoteIllegal, '"$1"$3');
			return sum + newLine + '\n';
		}, '');

		return Promise.resolve(output);
	},
};
