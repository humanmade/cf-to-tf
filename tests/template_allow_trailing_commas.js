const awsGetTemplate = require('./../lib/template');
const AWS = require('aws-sdk-mock');

describe('', () => {
	test('allow_trailing_commas_in_template', () => {
		AWS.mock('CloudFormation', 'getTemplate', {
			TemplateBody: '{"mocked": [true,], "trailing commas": "are OK",}',
		});
		const expected = {"mocked": [true], "trailing commas": "are OK"};
		return awsGetTemplate({}).then(result => {
			expect(result).toEqual(expected);
		});
	});
});
