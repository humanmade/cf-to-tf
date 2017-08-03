const AWS = require('aws-sdk');

module.exports = opts => {
	const CF = new AWS.CloudFormation({ apiVersion: '2010-05-15' });
	return CF.describeStacks({
		StackName: opts.stack,
	}).promise();
};
