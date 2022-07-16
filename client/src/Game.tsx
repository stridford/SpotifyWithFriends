import {useParams, useSearchParams} from "react-router-dom";
import {Drawer, TextField} from "@mui/material";
import React, {useEffect, useMemo, useState} from "react";
import axios from "axios";
import {TrackResults} from "./TrackResults";
import {Nullable} from "./global";
import Box from "@mui/material/Box";
import {Playlist} from "./Playlist";


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
            fetchTracks(searchInput.trim()).then(tracks => {
                if (isSubscribed) {
                    const currentPlaylistTrackIds = playlist.map(track => track.trackId);
                    const tracksNotInPlaylist = tracks.filter(track => !currentPlaylistTrackIds.includes(track.trackId));
                    setTracks(tracksNotInPlaylist);
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
        addTrackToPlaylist(gameCode, player, selectedTrack.trackId).then(response => {
            console.log(response);
        })
        // send ws message that a track was added
    }

    return (
        <div>
            {/*<Button variant="contained"*/}
            {/*        onClick={onCopyJoiningUrl}*/}
            {/*        className={"listenButton"}>Get joining url</Button>*/}
            <Box>
                <Drawer variant="permanent"
                        PaperProps={{sx: {width: 500}}}>
                    <TextField id="outlined-basic"
                               label="Search tracks..."
                               onChange={handleActualSearchInputChange}
                               sx={{m: 3}}
                               autoComplete="off"
                               variant="outlined"/>
                    <Box>
                        <TrackResults searchResultDTOS={tracks}
                                      onTrackClick={handleTrackClick}
                                      isSearching={isSearching}/>
                    </Box>

                </Drawer>
                <Playlist playlist={playlist}/>
            </Box>
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

async function addTrackToPlaylist(gameId: Nullable<string>, addedByPlayer: Nullable<string>, trackId: string) {
    if (!gameId) {
        console.error('No game id');
        return;
    }
    if (!addedByPlayer) {
        console.error('No player that added song');
        return;
    }
    const addSongToPlaylistDTO: AddSongToPlaylistDTO = {
        gameId,
        addedByPlayer,
        trackId
    }
    const axiosResponse = await axios.put(`https://6h78kwqsuh.execute-api.ap-southeast-2.amazonaws.com/serverless_lambda_stage/playlist`, addSongToPlaylistDTO);
    return axiosResponse.data;
}

function debounce(fn: Function, ms = 300): (this: any, ...args: any[]) => void {
    let timeoutId: ReturnType<typeof setTimeout>;
    return function (this: any, ...args: any[]) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), ms);
    };
}