import {useParams, useSearchParams} from "react-router-dom";
import {Button, Container, Stack, TextField} from "@mui/material";
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
        let isSubscribed = true;
        if (searchInput.trim().length == 0) {
            setTracks([]);
            return () => {
                isSubscribed = false;
            }
        }
        fetchTracks(searchInput).then(result => {
            if (isSubscribed) {
                setTracks(result);
            }
        });
        return () => {
            isSubscribed = false;
        }
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
            {/*<Button variant="contained"*/}
            {/*        onClick={onCopyJoiningUrl}*/}
            {/*        className={"listenButton"}>Get joining url</Button>*/}
            <Stack width="600px">
                <TextField id="outlined-basic"
                           label="Search tracks..."
                           value={searchInput}
                           onChange={handleSearchInputChange}
                           autoComplete="off"
                           variant="outlined"/>
                {tracks.map(track => <SpotifySearchTrackResult key={track.trackId} track={track}/>)}
            </Stack>
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

function debounce(fn: Function, ms = 300): (this: any, ...args: any[]) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
}