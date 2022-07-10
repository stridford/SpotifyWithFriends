import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";

export function SpotifySearchTrackResult() {

    const track: any = {
        "album": {
            "album_type": "single",
            "artists": [
                {
                    "external_urls": {
                        "spotify": "https://open.spotify.com/artist/5bgW1AysTzHav20snaPkyp"
                    },
                    "href": "https://api.spotify.com/v1/artists/5bgW1AysTzHav20snaPkyp",
                    "id": "5bgW1AysTzHav20snaPkyp",
                    "name": "Imperial Circus Dead Decadence",
                    "type": "artist",
                    "uri": "spotify:artist:5bgW1AysTzHav20snaPkyp"
                }
            ],
            "external_urls": {
                "spotify": "https://open.spotify.com/album/1KQPuhtXXec6vVVFqoXq2q"
            },
            "href": "https://api.spotify.com/v1/albums/1KQPuhtXXec6vVVFqoXq2q",
            "id": "1KQPuhtXXec6vVVFqoXq2q",
            "images": [
                {
                    "height": 640,
                    "url": "https://i.scdn.co/image/ab67616d0000b273f02911b93ef40fe9896312fe",
                    "width": 640
                },
                {
                    "height": 300,
                    "url": "https://i.scdn.co/image/ab67616d00001e02f02911b93ef40fe9896312fe",
                    "width": 300
                },
                {
                    "height": 64,
                    "url": "https://i.scdn.co/image/ab67616d00004851f02911b93ef40fe9896312fe",
                    "width": 64
                }
            ],
            "name": "黄泉より聴こゆ、皇国の燈と焔の少女。",
            "release_date": "2015-01-20",
            "release_date_precision": "day",
            "total_tracks": 4,
            "type": "album",
            "uri": "spotify:album:1KQPuhtXXec6vVVFqoXq2q"
        },
        "artists": [
            {
                "external_urls": {
                    "spotify": "https://open.spotify.com/artist/5bgW1AysTzHav20snaPkyp"
                },
                "href": "https://api.spotify.com/v1/artists/5bgW1AysTzHav20snaPkyp",
                "id": "5bgW1AysTzHav20snaPkyp",
                "name": "Imperial Circus Dead Decadence",
                "type": "artist",
                "uri": "spotify:artist:5bgW1AysTzHav20snaPkyp"
            }
        ],
        "disc_number": 1,
        "duration_ms": 498981,
        "explicit": false,
        "external_ids": {
            "isrc": "JPV751900925"
        },
        "external_urls": {
            "spotify": "https://open.spotify.com/track/4d1bJi6R3XJQARgyKwZi3d"
        },
        "href": "https://api.spotify.com/v1/tracks/4d1bJi6R3XJQARgyKwZi3d",
        "id": "4d1bJi6R3XJQARgyKwZi3d",
        "is_local": false,
        "is_playable": true,
        "name": "黄泉より聴こゆ、皇国の燈と焔の少女。",
        "popularity": 47,
        "preview_url": "https://p.scdn.co/mp3-preview/55c65cc17615dcc46d9fd09107432b83b8fbdc83?cid=9a21760d280d408eaa0de0e78215c1e0",
        "track_number": 1,
        "type": "track",
        "uri": "spotify:track:4d1bJi6R3XJQARgyKwZi3d"
    }

    return (
        <Card sx={{display: 'flex'}}>
            <CardMedia
                component="img"
                sx={{width: 120}}
                image={track.album.images[0].url}
            />
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <CardContent sx={{flex: '1 0 auto'}}>
                    <Typography component="div"
                                variant="subtitle1">
                        {track.name}
                    </Typography>
                    <Typography variant="subtitle1"
                                color="text.secondary"
                                component="div">
                        {track.artists[0].name}
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    )


}