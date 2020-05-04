var track_length = 8;

var tracks = [];

for (var j = 0; j < 2; j++) {


    for (var i = 0; i < track_length; i++) {
        tracks.push({
            img: 'assets/tracks/track-' + (i + 1) + '.png',
            id: 'track-' + i
        });

        var previewWrap = document.createElement('div');
        previewWrap.classList = 'preview-track preview-track-' + i;

        $(previewWrap).css('background-image', 'url(' + tracks[i].img + ')');

        document.getElementById('all-tracks').appendChild(previewWrap);
    }
}

var prevIndex = -1;
$('.preview-track').click(function(elem) {

    if (prevIndex === $(elem.target).index()) {
        $('#track-area .track-wrap-highlight').removeClass('show');
        prevIndex = -1;
    } else {
        console.log($(elem.target).index());
        prevIndex = $(elem.target).index();
        $('#track-area .track-wrap-highlight').addClass('show');
        $('#track-area .track-wrap-highlight').css('background-image', 'url(' + tracks[prevIndex].img + ')');
    }
});

$('button').click(function() {
    console.log('redirect auslosung');
    window.location = 'chooser.html';
});