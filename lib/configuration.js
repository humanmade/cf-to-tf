const shared = require('./shared');

module.exports = {
	keyMapping: {
		Capabilities: 'capabilities',
		StackName: 'name',
		DisableRollback: 'disable_rollback',
	},
	generate(options, stack) {
		const parameters = [
			this.generateAttributeObject(
				stack,
				'Parameters',
				'ParameterKey',
				'ParameterValue'
			),
		];
		const tags = [this.generateAttributeObject(stack, 'Tags', 'Key', 'Value')];

		const resource = Object.assign(
			{},
			{ parameters, tags },
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
	generateAttributeObject(stack, attribute, attributeKey, attributeValue) {
		const isObjectArray = this.isObjectArray(stack[attribute]);
		return stack[attribute].reduce((sum, thing, currentIndex) => {
			if (isObjectArray) {
				key = thing[attributeKey];
				value = thing[attributeValue];
			} else {
				key = currentIndex;
				value = thing;
			}
			return Object.assign(sum, {
				[key]: value,
			});
		}, {});
	},
	isObjectArray(thing) {
		return typeof thing[0] === 'object';
	},
};
