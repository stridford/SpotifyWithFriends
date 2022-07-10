# https://learn.hashicorp.com/tutorials/terraform/lambda-api-gateway
# https://dynobase.dev/dynamodb-terraform/

terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.22.0"
    }
    random = {
      source  = "hashicorp/random"
      version = "~> 3.1.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.2.0"
    }
  }

  required_version = "~> 1.0"
}

provider "aws" {
  region = var.aws_region
}

resource "random_pet" "lambda_bucket_name" {
  prefix = "learn-terraform-functions"
  length = 4
}

resource "aws_s3_bucket" "lambda_bucket" {
  bucket = random_pet.lambda_bucket_name.id

  force_destroy = true
}

data "archive_file" "lambda_hello_world" { # this zipping logic could also be in a postbuild npm script like in the AWS CLI and esbuild example
  type = "zip"

  source_dir  = "${path.module}/lambda/hello-world/dist" # grabs all files in this directory and zips them up
  output_path = "${path.module}/lambda/hello-world.zip"
}

data "archive_file" "lambda_search-spotify" {
  type = "zip"

  source_dir  = "${path.module}/lambda/search-spotify/dist" # grabs all files in this directory and zips them up
  output_path = "${path.module}/lambda/search-spotify.zip"
}

resource "aws_s3_object" "lambda_hello_world" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "hello-world.zip"
  source = data.archive_file.lambda_hello_world.output_path

  etag = filemd5(data.archive_file.lambda_hello_world.output_path)
}

resource "aws_s3_object" "lambda_search-spotify" {
  bucket = aws_s3_bucket.lambda_bucket.id

  key    = "search-spotify.zip"
  source = data.archive_file.lambda_search-spotify.output_path

  etag = filemd5(data.archive_file.lambda_search-spotify.output_path)
}

/*
aws_lambda_function.hello_world configures the Lambda function to use the bucket object containing your function code. It also sets the runtime to NodeJS 12.x,
and assigns the handler to the handler function defined in hello.js. The source_code_hash attribute will change whenever you update the code contained in the
archive, which lets Lambda know that there is a new version of your code available. Finally, the resource specifies a role which grants the function permission
to access AWS services and resources in your account.
*/
resource "aws_lambda_function" "hello_world" {
  function_name = "HelloWorld"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_hello_world.key

  runtime = "nodejs16.x"
  handler = "hello.handler"

  source_code_hash = data.archive_file.lambda_hello_world.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}

resource "aws_lambda_function" "search-spotify" {
  function_name = "SearchSpotify"

  s3_bucket = aws_s3_bucket.lambda_bucket.id
  s3_key    = aws_s3_object.lambda_search-spotify.key

  runtime = "nodejs16.x"
  handler = "searchSpotify.handler"

  source_code_hash = data.archive_file.lambda_search-spotify.output_base64sha256

  role = aws_iam_role.lambda_exec.arn
}
/*
aws_cloudwatch_log_group.hello_world defines a log group to store log messages from your Lambda function for 30 days. By convention, Lambda stores logs in a
group with the name /aws/lambda/<Function Name>.
*/
resource "aws_cloudwatch_log_group" "hello_world" {
  name = "/aws/lambda/${aws_lambda_function.hello_world.function_name}"

  retention_in_days = 30
}

resource "aws_cloudwatch_log_group" "search_spotify" {
  name = "/aws/lambda/${aws_lambda_function.search-spotify.function_name}"

  retention_in_days = 30
}

#aws_iam_role.lambda_exec defines an IAM role that allows Lambda to access resources in your AWS account.
# creates a role. specifies a trust policy (assume role policy) that allows lambda to assume it
resource "aws_iam_role" "lambda_exec" {
  name = "serverless_lambda"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Sid    = ""
      Principal = {
        Service = "lambda.amazonaws.com"
      }
      }
    ]
  })
}

#aws_iam_role_policy_attachment.lambda_policy attaches a policy the IAM role. The AWSLambdaBasicExecutionRole is an AWS managed policy that allows your Lambda function to write to CloudWatch logs.
# Can we attach multiple policies to the same role in 1 statment? or do we have to split it out?
resource "aws_iam_role_policy_attachment" "lambda_execution_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_dynamodb_policy" {
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonDynamoDBFullAccess"
}

resource "aws_iam_role_policy_attachment" "lambda_admin_policy" { # TODO: make this more fine grained later
  role       = aws_iam_role.lambda_exec.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}

resource "aws_apigatewayv2_api" "lambda" {
  name          = "serverless_lambda_gw"
  protocol_type = "HTTP"
}

resource "aws_apigatewayv2_stage" "lambda" {
  api_id = aws_apigatewayv2_api.lambda.id

  name        = "serverless_lambda_stage"
  auto_deploy = true

  access_log_settings {
    destination_arn = aws_cloudwatch_log_group.api_gw.arn

    format = jsonencode({
      requestId               = "$context.requestId"
      sourceIp                = "$context.identity.sourceIp"
      requestTime             = "$context.requestTime"
      protocol                = "$context.protocol"
      httpMethod              = "$context.httpMethod"
      resourcePath            = "$context.resourcePath"
      routeKey                = "$context.routeKey"
      status                  = "$context.status"
      responseLength          = "$context.responseLength"
      integrationErrorMessage = "$context.integrationErrorMessage"
      }
    )
  }
}

resource "aws_apigatewayv2_integration" "hello_world" {
  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.hello_world.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "hello_world" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "GET /hello"
  target    = "integrations/${aws_apigatewayv2_integration.hello_world.id}"
}

resource "aws_apigatewayv2_integration" "search_spotify" {
  api_id = aws_apigatewayv2_api.lambda.id

  integration_uri    = aws_lambda_function.search-spotify.invoke_arn
  integration_type   = "AWS_PROXY"
  integration_method = "POST"
}

resource "aws_apigatewayv2_route" "search_spotify" {
  api_id = aws_apigatewayv2_api.lambda.id

  route_key = "GET /search-spotify"
  target    = "integrations/${aws_apigatewayv2_integration.search_spotify.id}"
}

resource "aws_cloudwatch_log_group" "api_gw" {
  name = "/aws/api_gw/${aws_apigatewayv2_api.lambda.name}"

  retention_in_days = 30
}

resource "aws_lambda_permission" "api_gw" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.hello_world.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_gw_search_spotify" {
  statement_id  = "AllowExecutionFromAPIGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.search-spotify.function_name
  principal     = "apigateway.amazonaws.com"

  source_arn = "${aws_apigatewayv2_api.lambda.execution_arn}/*/*"
}

resource "aws_dynamodb_table" "playlist-table" {
  name         = "playlist-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"
  range_key    = "gameId"

  attribute { # When defining attributes, only need to define the key schema for the table and indexes. you can create additional attributes with your application
    name = "id"
    type = "S"
  }

  attribute {
    name = "gameId"
    type = "S"
  }
}