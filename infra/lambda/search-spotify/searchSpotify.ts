import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {


    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'hallo',
        }),
    };
};
