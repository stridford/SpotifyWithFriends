import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";

export function SpotifySearchTrackResult(props: { track: SearchResultDTO, onTrackClick: (track: SearchResultDTO) => void }) {
    const track = props.track;

    return (
        <Card sx={{display: 'flex', height: "75px", cursor: "pointer"}}
              onClick={(e) => props.onTrackClick(track)}>
            <CardMedia
                component="img"
                sx={{width: 60}}
                image={track.imageUrl}
            />
            <Box>
                <CardContent>
                    <Typography component="div"
                                noWrap
                                variant="subtitle1">
                        {track.title}
                    </Typography>
                    <Typography variant="subtitle1"
                                noWrap
                                color="text.secondary"
                                component="div">
                        {track.artist}
                    </Typography>
                </CardContent>
            </Box>
        </Card>
    )


}