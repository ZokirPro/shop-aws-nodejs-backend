import type { AWS } from '@serverless/typescript';

import ImportProductsFile from '@functions/import-products-file';
import ImportParserFile from '@functions/import-file-parser';

const serverlessConfiguration: AWS = {
  service: 'import-service',
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
              "s3:PutObject",
              "s3:PutObjectAcl",
              "s3:GetObject",
              "s3:GetObjectAcl",
              "s3:DeleteObject",
              "s3:CopyObject",
            ],
            Resource: `arn:aws:s3:::node-in-aws-s3`,
          },
        ],
      },
    },
  },
  // import the function via paths
  functions: { ImportProductsFile, ImportParserFile },
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
    }
  },
};

module.exports = serverlessConfiguration;
