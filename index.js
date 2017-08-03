#!/usr/bin/env node --harmony

const program = require('commander');
const getStack = require('./lib/stack');
const configuration = require('./lib/configuration');
const state = require('./lib/state');

const formatOptions = opts => {
	return {
		stack: opts.parent.stack,
		resourceName: opts.parent.resourceName || 'main',
	};
};

const handleError = err => {
	console.log(err);
	process.exit(1);
};

program.option('-s, --stack <stack>', 'The CloudFormation stack to import');
program.option(
	'-r, --resource-name <resourceName>',
	'The name to assign the terraform resource'
);

program
	.command('config')
	.description('Generates Terraform configuration in JSON')
	.action(options => {
		const opts = formatOptions(options);
		return getStack(opts)
			.then(result => {
				return configuration.generate(opts, result.Stacks[0]);
			})
			.then(result => console.log(JSON.stringify(result)))
			.catch(err => handleError(err));
	});

program
	.command('state')
	.description('Generates Terraform state file in JSON')
	.action(options => {
		const opts = formatOptions(options);
		return getStack(opts)
			.then(result => {
				return state.generate(opts, result.Stacks[0]);
			})
			.then(result => console.log(JSON.stringify(result)))
			.catch(err => handleError(err));
	});

program.parse(process.argv);

// TODO mark required arguments
// TODO need to get cloudformation stack from AWS, then pass it to the
// generator
// TODO need to build a thing that will do things based on the args
