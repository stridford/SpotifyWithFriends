import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import NewGame from "./NewGame";
import ButtonAppBar from "./ButtonAppBar";
import Box from "@mui/material/Box";
import {Game} from "./Game";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Yang123322

root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ButtonAppBar></ButtonAppBar>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="70vh"
            >
                <Routes>
                    <Route path="/"
                           element={<App/>}/>
                    <Route path="/new"
                           element={<NewGame/>}/>
                    <Route path="/game" >
                        <Route path=":gameCode" element={<Game/>}/>
                    </Route>
                    <Route path="*"
                           element={<main style={{padding: "1rem"}}>
                               <p>There's nothing here!</p>
                           </main>
                           }
                    />
                </Routes>
            </Box>
        </BrowserRouter>
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
