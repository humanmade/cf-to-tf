const shared = require('./shared');

module.exports = {
	keyMapping: {
		StackName: 'name',
		DisableRollback: 'disable_rollback',
		StackId: 'id',
		IAMRoleARN: 'iam_role_arn',
	},
	generate(opts, stack) {
		let returns = {
			version: 3,
			serial: 1,
			modules: [
				{
					path: ['root'],
					outputs: {},
					resources: {
						[`aws_cloudformation_stack.${opts.resourceName}`]: {
							type: 'aws_cloudformation_stack',
							depends_on: [],
							primary: {
								id: stack.StackId,
								attributes: this.generateAttributes(stack),
								meta: {},
								tainted: false,
							},
							deposed: [],
							provider: '',
						},
					},
					depends_on: [],
				},
			],
		};

		return Promise.resolve(returns);
	},
	generateAttributes(stack) {
		return Object.assign(
			{},
			this.generateAttributeObject(
				stack,
				'Parameters',
				'parameters',
				'ParameterKey',
				'ParameterValue'
			),
			this.generateAttributeObject(stack, 'Tags', 'tags', 'Key', 'Value'),
			this.generateAttributeObject(stack, 'Capabilities', 'capabilities'),
			this.generateAttributeObject(
				stack,
				'Outputs',
				'outputs',
				'OutputKey',
				'OutputValue'
			),
			shared.mapKeys(this.keyMapping, stack, {
				stringify: true,
				allowMissing: true,
			})
		);
	},
	generateAttributeObject(
		stack,
		attribute,
		stateKey,
		attributeKey,
		attributeValue
	) {
		if (typeof stack[attribute] !== 'object') {
			return {};
		}
		const isObjectArray = this.isObjectArray(stack[attribute]);
		const sign = isObjectArray ? '%' : '#';
		return stack[attribute].reduce(
			(sum, thing, currentIndex) => {
				if (isObjectArray) {
					key = thing[attributeKey];
					value = thing[attributeValue];
				} else {
					key = currentIndex;
					value = thing;
				}
				return Object.assign(sum, {
					[`${stateKey}.${key}`]: value,
				});
			},
			{
				[`${stateKey}.${sign}`]: `${stack[attribute].length}`,
			}
		);
	},
	isObjectArray(thing) {
		return typeof thing === 'object' && typeof thing[0] === 'object';
	},
};
