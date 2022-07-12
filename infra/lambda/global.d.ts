type Nullable<T> = T | null | undefined;

type SearchResultDTO = {
    trackId: string,
    imageUrl: string,
    title: string,
    artist: string
}

type AddSongToPlaylistDTO = {
    gameId: string,
    addedByPlayer: string,
    trackId: string
}