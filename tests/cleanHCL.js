const cleanHCL = require('./../lib/cleanHCL');
const path = require('path');
const fs = require('fs');

test('clean', () => {
	const cwd = path.basename(__dirname);
	const hcl = fs.readFileSync(cwd + '/fixtures/example.tf', 'utf8');
	const expected = fs.readFileSync(cwd + '/fixtures/example-clean.tf', 'utf8');
	const opts = {};
	return cleanHCL.clean(opts, hcl).then(result => {
		expect(result).toEqual(expected);
	});
});
