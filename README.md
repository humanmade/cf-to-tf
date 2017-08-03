# CloudFormation to Terraform

This node CLI tool is used for generating both Terraform configuration files as well as Terraform state so that you can use Terraform to manage CloudFormation templates. To further clarify, it does not generate terraform configuration for the individual resources CloudFormation provisions, it generates an `aws_cloudformation_stack` resource so that you can manage your existing CloudFormation stacks with Terraform instead of or in conjunction with the AWS Console and CLI.

## Getting Started

As this repo isn't published to NPM yet, you will need to clone the repo locally and install it globally:

```
git clone git@github.com:humanmade/cf-to-tf.git cf-to-tf
cd cf-to-tf
npm install -g
```

From there, a `cf-to-tf` command will be available.

## Usage

```
Usage: cf-to-tf [options] [command]


Options:

-s, --stack <stack>                 The CloudFormation stack to import
-r, --resource-name <resourceName>  The name to assign the terraform resource
-h, --help                          output usage information


Commands:

config   Generates Terraform configuration in JSON
state    Generates Terraform state file in JSON
```

This tool is designed to be used in conjunction with other tools. It will only output the data to `STDOUT` and is designed to be piped to another program to write the file to a location. For example, to generate a configuration file for a stack named `lambda-resources`, we could do the following:

```
cf-to-tf -s lambda-resources config | tee main.tf.json
```

This command will fetch a CloudFormation stack named `lambda-resources` and generate the required Terraform configuration for it. We then pipe the output to `tee` which will write to a file named `main.tf.json`. Because HCL is JSON compatible, Terraform can read the `main.tf.json` natively.

To generate the associated Terraform state for this CloudFormation stack, you would run the following:

```
cf-to-tf -s lambda-resources state | tee terraform.tfstate
```

This will create a state file from scratch. It assumes you don't already have an existing state file in place. I'm considering updating the tool to write just the resource portion of the state so it can be added to an existing state file, but that wasn't an immediate priority.

Both of these commands will generate compressed JSON output, meaning whitespace has been stripped. To pretty print the output for enhanced readability, you could pipe the output to `jq`, and then to `tee`:

```
cf-to-tf -s lambda-resources config | jq '.' | tee main.tf.json
cf-to-tf -s lambda-resources state | jq '.' | tee terraform.tfstate
```

It's also possible to use a tool called [`json2hcl`](https://github.com/kvz/json2hcl) to generate HCL:

```
cf-to-tf -s lambda-resources config | json2hcl | tee main.tf
```

The command uses the AWS SDK under the hood to retrieve the CloudFormation stack details, so set your authentication credentials as you would normally (`~/.aws/credentials`, `AWS_PROFILE`, `AWS_REGION`, etc).
