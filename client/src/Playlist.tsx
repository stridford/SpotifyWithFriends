import React from "react";
import Box from "@mui/material/Box";
import {PlaylistItem} from "./PlaylistItem";

export function Playlist(props: { playlist: SearchResultDTO[] }) {
    return (<Box width={500}>
        {props.playlist.map(track => <PlaylistItem track={track}></PlaylistItem>)}
    </Box>) ;
}