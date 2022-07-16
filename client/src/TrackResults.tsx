import React from "react";
import {SpotifySearchTrackResult} from "./SpotifySearchTrackResult";
import Typography from "@mui/material/Typography";
import {Stack} from "@mui/material";

export function TrackResults(props: { searchResultDTOS: SearchResultDTO[], isSearching: boolean, onTrackClick: (track: SearchResultDTO) => void }) {
    const searchResultDTOS = props.searchResultDTOS;
    const isSearching = props.isSearching;
    if (isSearching) {
        return (<Typography>Loading...</Typography>)
    }
    return (<Stack spacing={1} sx={{ml: 3, mr: 3}}>
        {searchResultDTOS.map(track => <SpotifySearchTrackResult key={track.trackId}
                                                                 onTrackClick={props.onTrackClick}
                                                                 track={track}/>)}
    </Stack>)
}