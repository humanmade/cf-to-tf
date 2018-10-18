const AWS = require('aws-sdk');

module.exports = opts => {
	const CF = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
	return CF.getTemplate({
		StackName: opts.stack,
	})
		.promise()
		.then(result => JSON.parse(result.TemplateBody.replace(/,(\s*[})\]])/g, '$1')));
};
