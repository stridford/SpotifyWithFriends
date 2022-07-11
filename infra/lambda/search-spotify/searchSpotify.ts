import {APIGatewayEvent, APIGatewayProxyResult, Context} from 'aws-lambda';
import AWS from 'aws-sdk';
import axios, {AxiosResponse} from "axios";
import TrackSearchResponse = SpotifyApi.TrackSearchResponse;
import TrackObjectFull = SpotifyApi.TrackObjectFull;

const ssm = new AWS.SSM({region: 'ap-southeast-2'});

let spotifyApiAccessToken: Nullable<string> = null;
let clientId: Nullable<string> = null;
let clientSecret: Nullable<string> = null;

export const handler = async function (event: APIGatewayEvent, context: Context): Promise<APIGatewayProxyResult> {

    if (!clientId && !clientSecret) {
        const clientIdResult = await ssm.getParameter({Name: '/spotify-api/client-id', WithDecryption: true}).promise();
        const clientSecretResult = await ssm.getParameter({Name: '/spotify-api/client-secret', WithDecryption: true}).promise();

        clientId = clientIdResult.Parameter?.Value;
        clientSecret = clientSecretResult.Parameter?.Value;
    }

    if (!clientId) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: 'no client id'
        }
    }

    if (!clientSecret) {
        return {
            statusCode: 500,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: 'no client secret'
        }
    }

    if (!spotifyApiAccessToken) {
        spotifyApiAccessToken = await fetchSpotifyApiAccessToken(clientId, clientSecret)
    }

    const searchQuery: Nullable<string> = event?.queryStringParameters?.search;

    if (!searchQuery) {
        return {
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Headers" : "Content-Type",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
            },
            body: JSON.stringify([]),
        };
    }

    const tracks = await fetchSpotifyApiSearchResults(spotifyApiAccessToken, searchQuery);
    const searchResultDTOS = tracks.map(toSearchResultDTO);

    return {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
        },
        body: JSON.stringify(searchResultDTOS),
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

function toSearchResultDTO(track: TrackObjectFull): SearchResultDTO {
    return {
        trackId: track.id,
        title: track.name,
        artist: track.artists[0].name,
        imageUrl: track.album.images[0].url
    }
}