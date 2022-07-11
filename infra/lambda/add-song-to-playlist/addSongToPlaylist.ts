import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';


export const handler = async function (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {


    return {
        statusCode: 200,
        body: "added to playlist",
    };
};