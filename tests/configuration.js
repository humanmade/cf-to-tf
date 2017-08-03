const configuration = require('./../lib/configuration');

describe('', () => {
	test('generate', () => {
		const cf = require('./fixtures/describe-stacks.json');
		const expected = require('./fixtures/example.tf.json');
		const opts = {
			stack: 'lambda-monitoring',
			resourceName: 'network',
		};
		return configuration.generate(opts, cf.Stacks[0]).then(result => {
			expect(result).toEqual(expected);
		});
	});
});
