const shared = require('./shared');

module.exports = {
	keyMapping: {
		StackName: 'name',
		Capabilities: {
			name: 'capabilities',
			default: [],
			required: false,
		},
		DisableRollback: {
			name: 'disable_rollback',
			required: false,
		},
	},
	generate(options, stack) {
		const resource = Object.assign({}, shared.mapKeys(this.keyMapping, stack));

		const things = [
			{
				key: 'parameters',
				value: this.generateAttributeObject(
					stack['Parameters'],
					'ParameterKey',
					'ParameterValue'
				),
			},
			{
				key: 'tags',
				value: this.generateAttributeObject(stack['Tags'], 'Key', 'Value'),
			},
		];

		const parameters = things.reduce((sum, thing) => {
			if (typeof thing.value !== 'undefined') {
				const newThing = Object.assign({}, sum, {
					[thing.key]: [thing.value],
				});
				return newThing;
			}
		}, {});

		const returns = {
			resource: {
				aws_cloudformation_stack: {
					[options.resourceName]: Object.assign({}, resource, parameters),
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
	generateAttributeObject(attributes, attributeKey, attributeValue) {
		if (!attributes) return;
		const isObjectArray = this.isObjectArray(attributes);
		return attributes.reduce((sum, thing, currentIndex) => {
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
		return typeof thing === 'object' && typeof thing[0] === 'object';
	},
};
