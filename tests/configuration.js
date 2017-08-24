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

	test('does not break when paremeters field is not present', () => {
		const cf = require('./fixtures/describe-stacks.json');
		const expected = require('./fixtures/example.tf.json');
		delete cf.Stacks[0].Parameters;
		delete expected.resource.aws_cloudformation_stack.network.parameters;
		const opts = {
			stack: 'lambda-monitoring',
			resourceName: 'network',
		};
		return configuration.generate(opts, cf.Stacks[0]).then(result => {
			expect(result).toEqual(expected);
		});
	});

	test('sets different default value when it needs a different one', () => {
		let cf = require('./fixtures/describe-stacks.json');
		let expected = require('./fixtures/example.tf.json');
		delete cf.Stacks[0].Capabilities;
		delete expected.resource.aws_cloudformation_stack.network.capabilities;
		const opts = {
			stack: 'lambda-monitoring',
			resourceName: 'network',
		};
		return configuration.generate(opts, cf.Stacks[0]).then(result => {
			expect(result).toEqual(expected);
		});
	});
});
