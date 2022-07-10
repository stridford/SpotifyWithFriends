import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";

type SpotifySearchTrackResultProps = {
    track: SearchResultDTO
}

export function SpotifySearchTrackResult(props: SpotifySearchTrackResultProps) {

    const track = props.track;

    return (
        <Card sx={{display: 'flex'}}>
            <CardMedia
                component="img"
                sx={{width: 120}}
                image={track.imageUrl}
            />
            <Box sx={{display: 'flex', flexDirection: 'column'}}>
                <CardContent sx={{flex: '1 0 auto'}}>
                    <Typography component="div"
                                variant="subtitle1">
                        {track.title}
                    </Typography>
                    <Typography variant="subtitle1"
                                color="text.secondary"
                                component="div">
                        {track.artist}
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    )


}