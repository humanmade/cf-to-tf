const shared = require('./shared');

module.exports = {
	keyMapping: {
		Capabilities: 'capabilities',
		StackName: 'name',
		DisableRollback: 'disable_rollback',
	},
	generate(options, stack) {
		const parameters = [this.generateParameters(stack)];

		const resource = Object.assign(
			{},
			{ parameters },
			shared.mapKeys(this.keyMapping, stack)
		);

		const returns = {
			resource: {
				aws_cloudformation_stack: {
					[options.resourceName]: resource,
				},
			},
		};
		return Promise.resolve(returns);
	},
	generateParameters(stack) {
		return stack.Parameters.reduce((sum, parameter) => {
			return Object.assign(sum, {
				[parameter.ParameterKey]: parameter.ParameterValue,
			});
		}, {});
	},
};
