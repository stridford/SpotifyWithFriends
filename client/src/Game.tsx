import {useParams, useSearchParams} from "react-router-dom";
import {Button, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import {SpotifySearchTrackResult} from "./SpotifySearchTrackResult";
import Autocomplete from "@mui/material/Autocomplete";

const tracks: SearchResultDTO[] = [
    {
        artist: 'artist guy',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273b7b55d090d6b465130691a73',
        title: 'title'
    },
    {
        artist: 'artist guy1',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273b7b55d090d6b465130691a73',
        title: 'title1'
    },

]

export function Game() {

    const [searchParams, setSearchParams] = useSearchParams();
    const {gameCode} = useParams();
    const [searchInput, setSearchInput] = useState('');
    const player = searchParams.get('player');

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
                <SpotifySearchTrackResult track={tracks[0]}></SpotifySearchTrackResult>
                <SpotifySearchTrackResult track={tracks[1]}></SpotifySearchTrackResult>
                <TextField id="outlined-basic"
                           label="Search tracks..."
                           value={searchInput}
                           onChange={handleSearchInputChange}
                           autoComplete="off"
                           variant="outlined"/>
                <Button variant="contained"
                        onClick={onCopyJoiningUrl}
                        className={"listenButton"}>Get joining url</Button>
            </Stack>
        </div>
    )
}

function getJoiningUrl(gameCode: string): string { // if the function doesn't require state or props or other things declared in component, declare it outside component
    return `http://localhost:3000/new?gameCode=${gameCode}`;
}