import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import AWS from 'aws-sdk';
import axios, {AxiosResponse} from "axios";
import TrackSearchResponse = SpotifyApi.TrackSearchResponse;

const ssm = new AWS.SSM({region: 'ap-southeast-2'});

export const handler = async (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> => {

    const clientIdResult = await ssm.getParameter({Name: '/spotify-api/client-id', WithDecryption: true}).promise()
    const clientSecretResult = await ssm.getParameter({Name: '/spotify-api/client-secret', WithDecryption: true}).promise()

    const clientId1 = clientIdResult.Parameter?.Value;
    const clientSecret1 = clientSecretResult.Parameter?.Value;

    if (!clientId1) {
        console.error('No client id');
        return {
            statusCode: 500,
            body: 'no client id'
        }
    }

    if (!clientSecret1) {
        console.error('No client id');
        return {
            statusCode: 500,
            body: 'no client secret'
        }
    }

    const spotifyApiAccessToken = await fetchSpotifyApiAccessToken(clientId1, clientSecret1);
    const tracks = await fetchSpotifyApiSearchResults(spotifyApiAccessToken, 'imperial circus');

    return {
        statusCode: 200,
        body: JSON.stringify(tracks),
    };
};

async function fetchSpotifyApiAccessToken(clientId: string, clientSecret: string): Promise<string> {
    const data = {
        'grant_type': 'client_credentials'
    };

    const authToken = Buffer.from(`${clientId}:${clientSecret}`, 'utf-8').toString('base64');
    const config = {
        headers: {
            'Authorization': `Basic ${authToken}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    const tokenUrl = 'https://accounts.spotify.com/api/token';
    const response = await axios.post(tokenUrl, new URLSearchParams(data), config);
    return response.data.access_token;
}

async function fetchSpotifyApiSearchResults(accessToken: string, searchQuery: string): Promise<SpotifyApi.TrackObjectFull[]> {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    };
    const axiosResponse: AxiosResponse<TrackSearchResponse> = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(searchQuery)}&type=track&market=AU`, config);
    const message = axiosResponse.data;
    return message.tracks.items;
}