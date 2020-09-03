//init globals

const track_length = 75;

//init all tracks - load data and stuff
var tracks = [];

for (var i = 0; i < track_length; i++) {
    var track = {
        id: 'track-' + i,
        img: 'assets/tracks/track-' + (i + 1) + '.png',
        imgThumb: 'assets/tracks/thumbs/track-' + (i + 1) + '-thumb.png'
    };
    tracks.push(track);
}

localStorage.setItem('trackChooser', JSON.stringify({
    tracks: tracks,
    choosableTrackIndices: [],
    //chosenTracks: [] -> has results after choosing for reordering
}));

console.log(JSON.parse(localStorage.getItem('trackChooser')));