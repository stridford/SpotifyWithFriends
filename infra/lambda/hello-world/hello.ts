import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import {AWSError} from 'aws-sdk';
import DynamoDB, {PutItemOutput} from "aws-sdk/clients/dynamodb";


const dynamoDB = new DynamoDB({apiVersion: '2012-08-10'});


export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

  const item = {
    "id": {
      S: '123'
    },
    "gameId": {
      S: 'abc'
    },
    "songId": {
      S: '789'
    },
  };

  await dynamoDB.putItem({
    "TableName": "playlist-table",
    "Item": item
  }, onDynamoDbPutItem).promise();

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: getMessage(event),
    }),
  };
};

function onDynamoDbPutItem(error: AWSError, data: PutItemOutput): void {
  if (error) {
    console.error(`Error putting item into dynamo db: ${error}`);
  } else {
    console.log(`added item into dynamo db ${JSON.stringify(data, null, '  ')}`)
  }
}

function getMessage(event: APIGatewayEvent): string {
  if (event.queryStringParameters && event.queryStringParameters['Name']) {
    return `hello ${event.queryStringParameters['Name']}`
  }
  return 'hello world and dfdfdfd are for us';
}
