import React from "react";
import {SpotifySearchTrackResult} from "./SpotifySearchTrackResult";
import {CircularProgress, Stack} from "@mui/material";
import Box from "@mui/material/Box";

export function TrackResults(props: { searchResultDTOS: SearchResultDTO[], isSearching: boolean, onTrackClick: (track: SearchResultDTO) => void }) {
    const searchResultDTOS = props.searchResultDTOS;
    const isSearching = props.isSearching;
    return (<Stack spacing={1} sx={{ml: 3, mr: 3}}>
        {isSearching ? <Box
            display="flex"
            justifyContent="center">
            <CircularProgress />
        </Box>   : null}
        {searchResultDTOS.map(track => <SpotifySearchTrackResult key={track.trackId}
                                                                 onTrackClick={props.onTrackClick}
                                                                 track={track}/>)}
    </Stack>)
}