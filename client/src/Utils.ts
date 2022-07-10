import {GAME_CODE_LENGTH} from "./constants";

export function generateGameCode(): string {
    return makeid(GAME_CODE_LENGTH);
}

function makeid(length: number) : string {
    // https://stackoverflow.com/a/1349426
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}