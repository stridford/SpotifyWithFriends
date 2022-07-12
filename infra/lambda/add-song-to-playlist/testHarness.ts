import * as event from "./testEvent.json"
import {handler} from "./addSongToPlaylist";

const main = async () => {
    console.time('localTest');
    // @ts-ignore
    const result = await handler(event, null);
    console.dir(result);
    console.timeEnd('localTest');
}

main().catch(error => console.error(error));