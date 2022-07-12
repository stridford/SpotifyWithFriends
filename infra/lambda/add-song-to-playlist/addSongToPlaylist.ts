import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';


export const handler = async function (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {

    console.log(JSON.stringify(event, null, '  '));

    return {
        statusCode: 200,
        body: "added to playlist",
    };
};