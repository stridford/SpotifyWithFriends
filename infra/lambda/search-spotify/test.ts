import {fetchSpotifyApiAccessToken} from "./SpotifyApiUtils";
import axios, {AxiosResponse} from "axios";
import TrackSearchResponse = SpotifyApi.TrackSearchResponse; // TODO: figure out what this namespace isn't being resolved


fetchSpotifyApiAccessToken().then(onAccessTokenReceived)


async function onAccessTokenReceived(accessToken: string) {
    const config = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${accessToken}`
        }
    };
    const axiosResponse: AxiosResponse<TrackSearchResponse> = await axios.get('https://api.spotify.com/v1/search?q=imperial%20circus&type=track&market=AU', config);
    const message = axiosResponse.data;
    console.log(message.tracks);
}