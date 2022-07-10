import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import AWS from 'aws-sdk';

const ssm = new AWS.SSM({region: 'ap-southeast-2'});


export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

    const clientId = await ssm.getParameter({Name: '/spotify-api/client-id', WithDecryption: true}).promise()
    const clientSecret = await ssm.getParameter({Name: '/spotify-api/client-secret', WithDecryption: true}).promise()

    console.log(clientId);
    console.log(clientSecret);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'hallo',
        }),
    };
};
