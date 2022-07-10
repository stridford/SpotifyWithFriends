import axios from "axios";
import * as dotenv from 'dotenv'

dotenv.config({path: '../dev.env'}) // point to the .env file
// see: https://stackoverflow.com/a/62288163
//      https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import

export async function fetchSpotifyApiAccessToken(): Promise<string> {
    const data = {
        'grant_type': 'client_credentials'
    };

    const clientId = process.env.CLIENT_ID;
    const clientSecret = process.env.CLIENT_SECRET;

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
