const shared = require('./shared');
const awsGetTemplate = require('./template');

module.exports = {
	keyMapping: {
		StackName: 'name',
		DisableRollback: 'disable_rollback',
		StackId: 'id',
		IAMRoleARN: 'iam_role_arn',
	},
	generate(opts, stack) {
		return this.generateAttributes(stack).then(attributes => {
			return {
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
									attributes,
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
		});
	},
	generateAttributes(stack) {
		return awsGetTemplate({ stack: stack.StackName }).then(template => {
			return Object.assign(
				{},
				{
					template_body: JSON.stringify(template),
				},
				this.generateAttributeObject(
					stack['Parameters'],
					'parameters',
					'ParameterKey',
					'ParameterValue'
				),
				this.generateAttributeObject(stack['Tags'], 'tags', 'Key', 'Value'),
				this.generateAttributeObject(stack['Capabilities'], 'capabilities'),
				this.generateAttributeObject(
					stack['Outputs'],
					'outputs',
					'OutputKey',
					'OutputValue'
				),
				shared.mapKeys(this.keyMapping, stack, {
					stringify: true,
					allowMissing: true,
				})
			);
		});
	},
	generateAttributeObject(attributes, stateKey, attributeKey, attributeValue) {
		if (typeof attributes !== 'object') {
			return {};
		}
		const isObjectArray = this.isObjectArray(attributes);
		const sign = isObjectArray ? '%' : '#';
		return attributes.reduce(
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
				[`${stateKey}.${sign}`]: `${attributes.length}`,
			}
		);
	},
	isObjectArray(thing) {
		return typeof thing === 'object' && typeof thing[0] === 'object';
	},
};
