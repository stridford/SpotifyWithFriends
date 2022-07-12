import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import DynamoDB, {PutItemOutput} from "aws-sdk/clients/dynamodb";
import {AWSError} from "aws-sdk";

const dynamoDB = new DynamoDB({apiVersion: '2012-08-10', region: 'ap-southeast-2'});


export const handler = async function (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {

    const body = event.body;

    if (!body) {
        return {
            statusCode: 500,
            body: 'No body in request'
        }
    }

    const result: AddSongToPlaylistDTO = JSON.parse(body);

    const id = makeid(10);
    const item = {
        'id': {
            S: id
        },
        'gameId': {
            S: result.gameId
        },
        'trackId': {
            S: result.trackId
        },
        'addedByPlayer': {
            S: result.addedByPlayer
        }
    }

    await dynamoDB.putItem({
        "TableName": "playlist-table",
        "Item": item
    }, onDynamoDbPutItem).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(item),
    };
};

function makeid(length: number) : string {
    // https://stackoverflow.com/a/1349426
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

function onDynamoDbPutItem(error: AWSError, data: PutItemOutput): void {
    if (error) {
        console.error(`Error putting item into dynamo db: ${error}`);
    } else {
        console.log(`added item into dynamo db ${JSON.stringify(data, null, '  ')}`)
    }
}