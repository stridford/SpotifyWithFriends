import * as React from 'react';
import Typography from '@mui/material/Typography';
import {useNavigate} from "react-router-dom";

export default function ButtonAppBar() {

    let navigate = useNavigate();

    function handleClick(e: React.MouseEvent<HTMLAnchorElement> | React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        navigate('/');
    }

    return (
        <Typography
            variant="h6"
            onClick={handleClick}
            component="a"
            href="/"
            flex={1}
            justifyContent={"center"}
            sx={{
                mr: 2,
                display: {xs: 'none', md: 'flex'},
                color: 'inherit',
                textDecoration: 'none',
            }}>
            HAPPY FUN TIME GAMU
        </Typography>
    );
}
