import {useParams, useSearchParams} from "react-router-dom";
import {Stack, TextField} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {TrackResults} from "./TrackResults";

export function Game() {

    const [searchParams, setSearchParams] = useSearchParams();
    const {gameCode} = useParams();
    const player = searchParams.get('player');
    const [searchInput, setSearchInput] = useState<string>('');
    const [tracks, setTracks] = useState<SearchResultDTO[]>([]);
    const [isSearching, setIsSearching] = useState<boolean>(false);
    const [playlist, setPlaylist] = useState<SearchResultDTO[]>([]);

    // const debouncedFetchAndSet = useCallback(debounce(fetchAndSetTracks, 500), []);

    useEffect(() => {
        if (!searchInput.trim()) {
            setTracks([]);
            setIsSearching(false);
            return;
        }
        let isSubscribed = true;
        fetchAndSetTracks(searchInput);
        return () => {
            isSubscribed = false;
        }

        function fetchAndSetTracks(searchInput: string): void {
            fetchTracks(searchInput.trim()).then(result => {
                if (isSubscribed) {
                    setTracks(result);
                    setIsSearching(false);
                }
            });
        }
    }, [searchInput]);

    function onCopyJoiningUrl(): void { // TODO: include common copy icon in button

        if (!gameCode) {
            console.error('No game code');
            return;
        }
        const joiningUrl = getJoiningUrl(gameCode);
        navigator.clipboard.writeText(joiningUrl);
    }

    const debouncedHandler = useMemo(() => {
        return debounce(handleSearchInputChange, 500)
    }, [])

    function handleActualSearchInputChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setIsSearching(true)
        debouncedHandler(e)
    }

    function handleSearchInputChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) {
        setSearchInput(e.target.value);
    }

    function handleTrackClick(selectedTrack: SearchResultDTO) {
        // remove track from results
        const filtered = tracks.filter(track => track.trackId != selectedTrack.trackId);
        setTracks(filtered);
        // add item to playlist in dynamodb and ui
        const newPlaylist = playlist.concat(selectedTrack);
        setPlaylist(newPlaylist);
        // send ws message that a track was added
    }

    return (
        <div>
            {/*<Button variant="contained"*/}
            {/*        onClick={onCopyJoiningUrl}*/}
            {/*        className={"listenButton"}>Get joining url</Button>*/}
            <Stack width="600px">
                <TextField id="outlined-basic"
                           label="Search tracks..."
                           onChange={handleActualSearchInputChange}
                           autoComplete="off"
                           variant="outlined"/>
                <TrackResults searchResultDTOS={tracks}
                              onTrackClick={handleTrackClick}
                              isSearching={isSearching}/>
            </Stack>
            {playlist.map(track => <div key={track.trackId}>{track.title}</div>)}
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