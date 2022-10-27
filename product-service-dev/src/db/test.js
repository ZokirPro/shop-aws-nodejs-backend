var AWS = require("aws-sdk");
AWS.config.update({ region: "us-east-1" });
var ddb = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const params = {
  TableName: this.TableName,
  FilterExpression: "productId=:id",
  ExpressionAttributeValues: {
    ":id": { S: "901d5da5-bd2d-424f-99d6-3dea1f88d3c1" },
  },
  TableName: "stocks",
};

ddb.scan(params, function (err, data) {
  if (err) {
    console.log("Error", err);
  } else {
    console.log("Success", data);
    data.Items.forEach(function (element, index, array) {
      console.log(element);
    });
  }
});
