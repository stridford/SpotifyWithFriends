import React from "react";
import {SpotifySearchTrackResult} from "./SpotifySearchTrackResult";

export function TrackResults(props: { searchResultDTOS: SearchResultDTO[], isSearching: boolean, onTrackClick: (track: SearchResultDTO) => void }) {
    const searchResultDTOS = props.searchResultDTOS;
    const isSearching = props.isSearching;
    if (isSearching) {
        return (<div>Loading...</div>)
    }
    return (<div>
        {searchResultDTOS.map(track => <SpotifySearchTrackResult key={track.trackId}
                                                                 onTrackClick={props.onTrackClick}
                                                                 track={track}/>)}
    </div>)
}