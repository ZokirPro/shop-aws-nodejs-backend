import createProduct from './src/functions/create-product';
import getProductsList from '@functions/get-products-list';
import getProductById from "@functions/get-product-by-id"
import type { AWS } from '@serverless/typescript';

const localDynamoDBResources = {
  products: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "products",
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  },
  stocks: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "stocks",
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      ProvisionedThroughput: {
        ReadCapacityUnits: 1,
        WriteCapacityUnits: 1,
      },
    },
  },
};

const resources = false ? { Resources: localDynamoDBResources } : {}

const serverlessConfiguration: AWS = {
  service: 'product-service-dev',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', "serverless-offline"],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    iam: {
      role: {
        statements: [
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:DeleteItem",
            ],
            Resource: `arn:aws:dynamodb:us-east-1:178256066802:table/products`,
          },
          {
            Effect: "Allow",
            Action: [
              "dynamodb:Query",
              "dynamodb:Scan",
              "dynamodb:GetItem",
              "dynamodb:PutItem",
              "dynamodb:DeleteItem",
            ],
            Resource: `arn:aws:dynamodb:us-east-1:178256066802:table/stocks`,
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { getProductsList, getProductById, createProduct },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    "serverless-offline": {
      allowCache: true,
      noTimeOut: true,
      httpPort: 3000,
      lambdaPort: 3002
    },
    resources,
    useDotenv: true,
  },
};

module.exports = serverlessConfiguration;
