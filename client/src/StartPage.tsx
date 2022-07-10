import {Button, Stack} from "@mui/material";
import React from "react";
import {useNavigate} from "react-router-dom";

export default function StartPage() {

    let navigate = useNavigate();

    function handleStartClick(e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) {
        navigate('/new')
    }

    return (
        <div>
            <Stack spacing={5}
                   sx={{
                       textAlign: 'center'
                   }}>
                <div>
                    <div>Judging other people's music tastes has never been easier!</div>
                    <br/>
                    <div> Create shared playlists, vote on your favourite songs and see who voted for yours!</div>
                </div>
                <Button className={"appButton"}
                        onClick={handleStartClick}
                        variant="contained">Start</Button>
            </Stack>
        </div>
    );
}