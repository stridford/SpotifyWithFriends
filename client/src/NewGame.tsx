import {Button, Stack, TextField} from "@mui/material";
import React, {useState} from "react";
import {generateGameCode} from "./Utils";
import {useNavigate, useSearchParams} from "react-router-dom";
import {EnterGameTransition} from "./EnterGameTransition";

export default function NewGame() {

    const [name, setName] = useState('');
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    function onStartGameClick(): void {
        if (name) {
            const existingGameCode = searchParams.get('gameCode');
            if (existingGameCode) {
                navigateToGameWithCode(existingGameCode);
            } else {
                const newGameCode = generateGameCode();
                navigateToGameWithCode(newGameCode)
            }
        }
    }

    function navigateToGameWithCode(existingGameCode: string): void {
        const state: EnterGameTransition = {
            gameCode: existingGameCode
        };
        navigate(`/game/${existingGameCode}?player=${encodeURIComponent(name)}`, {
            state: state
        });
    }

    function handleNameChange(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>): void {
        setName(e.target.value);
    }

    return (
        <div>
            <Stack spacing={5}
                   sx={{
                       textAlign: 'center'
                   }}>
                <TextField id="outlined-basic"
                           label="Name"
                           value={name}
                           inputProps={{maxLength: 30}}
                           onChange={handleNameChange}
                           autoComplete="off"
                           variant="outlined"/>
                <Button variant="contained"
                        onClick={onStartGameClick}
                        className={"listenButton"}>Lets Listen!</Button>
            </Stack>
        </div>
    );
}