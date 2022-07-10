import * as event from "./testEvent.json"
import {handler} from "./searchSpotify";

const main = async () => {
    console.time('localTest');
    // @ts-ignore
    console.dir(await handler(event, null));
    console.timeEnd('localTest');
}

main().catch(error => console.error(error));