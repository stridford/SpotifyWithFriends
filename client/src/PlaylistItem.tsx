import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import {IconButton} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import {PlayArrow, SkipNext, SkipPrevious} from "@mui/icons-material";

export function PlaylistItem(props: { track: SearchResultDTO }) {
    const track = props.track;
    return (
        <Card sx={{display: 'flex'}}>
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
                <Box sx={{display: 'flex', alignItems: 'center', pl: 1, pb: 1}}>
                    <IconButton aria-label="previous">
                        <SkipPrevious/>
                    </IconButton>
                    <IconButton aria-label="play/pause">
                        <PlayArrow sx={{height: 38, width: 38}}/>
                    </IconButton>
                    <IconButton aria-label="next">
                        <SkipNext/>
                    </IconButton>
                </Box>
            </Box>
            <CardMedia
                component="img"
                sx={{width: 60}}
                image={track.imageUrl}
            />
        </Card>
    )
}