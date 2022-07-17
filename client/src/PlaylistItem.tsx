import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import {Grid, IconButton} from "@mui/material";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import CardMedia from "@mui/material/CardMedia";
import {PlayArrow} from "@mui/icons-material";

export function PlaylistItem(props: { track: SearchResultDTO }) {
    const track = props.track;
    return (
        <Card sx={{display: 'flex'}}>
            <Grid container spacing={1}>
                <Grid item xs={3}>
                    <div style={{position: 'relative'}}>
                        <IconButton aria-label="play/pause" sx={{position: 'absolute'}}>
                            <PlayArrow sx={{height: 38, width: 38}}/>
                        </IconButton>
                        <CardMedia
                            component="img"
                            sx={{width: 60, height: 60}}
                            image={track.imageUrl}
                        />
                    </div>
                </Grid>
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
                    </Box>
                </Box>
            </Grid>

        </Card>
    )
}