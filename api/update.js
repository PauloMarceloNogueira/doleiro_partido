'use strict'

const AWS = require('aws-sdk'); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.update = (event, context, callback) => {
  const timestamp = new Date().getTime()
  const data = JSON.parse(event.body)

  if (typeof data.name !== 'string' || typeof data.color !== 'string') {
    console.log("Error Validation")
    callback(new Error('Não foi possível editar o partido ' + data.name));
    return;
  }

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
    ExpressionAttributeNames: {
      '#party_name': 'name',
    },
    UpdateExpression: 'set #party_name = :name, color = :color',
    ExpressionAttributeValues: {
      ":name" : data.name,
      ":color" : data.color
    },
    ReturnValues:"UPDATED_NEW"
  }

  dynamoDb.update(params,(error,result) => {
    if (error) {
      console.log(error)
      callback(new Error('Erro ao editar o partido.'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
    callback(null, response);
  });
};
