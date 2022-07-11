import {useParams, useSearchParams} from "react-router-dom";
import {Button, Stack, TextField} from "@mui/material";
import React, {useEffect, useState} from "react";
import {SpotifySearchTrackResult} from "./SpotifySearchTrackResult";
import Autocomplete from "@mui/material/Autocomplete";
import axios from "axios";

export function Game() {

    const [searchParams, setSearchParams] = useSearchParams();
    const {gameCode} = useParams();
    const player = searchParams.get('player');
    const [searchInput, setSearchInput] = useState('');
    const [tracks, setTracks] = useState<SearchResultDTO[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const result = await axios(
                `https://6h78kwqsuh.execute-api.ap-southeast-2.amazonaws.com/serverless_lambda_stage/search-spotify?search=${encodeURIComponent(searchInput)}`,
            );

            setTracks(result.data);
        };

        fetchData();
    }, [searchInput]);

    if (!gameCode) {
        console.error('No game code found, dont render element');
        return null;
    }

    const joiningUrl = getJoiningUrl(gameCode);

    function onCopyJoiningUrl(): void { // TODO: include common copy icon in button
        navigator.clipboard.writeText(joiningUrl);
    }


    function handleSearchInputChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setSearchInput(e.target.value);
    }

    return (
        <div>
            <Stack spacing={5}
                   sx={{
                       textAlign: 'center'
                   }}>
                <div>
                    Welcome {player}!
                </div>
                <div>
                    Let's play some music!
                </div>
                <TextField id="outlined-basic"
                           label="Search tracks..."
                           value={searchInput}
                           onChange={handleSearchInputChange}
                           autoComplete="off"
                           variant="outlined"/>

            </Stack>
            {tracks.map(track => <SpotifySearchTrackResult key={track.trackId} track={track}/>)}
            <Button variant="contained"
                    onClick={onCopyJoiningUrl}
                    className={"listenButton"}>Get joining url</Button>
        </div>
    )
}

function getJoiningUrl(gameCode: string): string { // if the function doesn't require state or props or other things declared in component, declare it outside component
    return `http://localhost:3000/new?gameCode=${gameCode}`;
}

async function fetchTracks(search: string): Promise<SearchResultDTO[]> {
    const axiosResponse = await axios.get(`https://6h78kwqsuh.execute-api.ap-southeast-2.amazonaws.com/serverless_lambda_stage/search-spotify?search=${encodeURIComponent(search)}`);
    return axiosResponse.data
}