var track_length = 8;

var tracks = [];

for (var j = 0; j < 2; j++) {


    for (var i = 0; i < track_length; i++) {
        tracks.push({
            img: 'assets/tracks/track-' + (i + 1) + '.png',
            imgFull: 'assets/tracks/track-' + (i + 1) + '-full.png',
            id: 'track-' + i
        });

        var previewWrap = document.createElement('div');
        previewWrap.classList = 'preview-track preview-track-' + i;

        $(previewWrap).css('background-image', 'url(' + tracks[i].img + ')');

        document.getElementById('all-tracks').appendChild(previewWrap);
    }
}

var prevIndex = -1;

//preview track hover: show small image
$('.preview-track').mouseover(function(el) {
    if (prevIndex > -1) {
        return;
    }
    $('.track-wrap').addClass('show');
    $('#track-area .track-wrap-highlight').css('background-image', 'url(assets/tracks/track-' + ($(el.target).index() % track_length) + '.png')
}).mouseout(function(el) {
    if (prevIndex > -1) {
        return;
    }
    $('.track-wrap').removeClass('show');
    $('#track-area .track-wrap-highlight').css('background-image', '')
})

//preview track click: show big image.
$('.preview-track').click(function(el) {

    if (prevIndex === $(el.target).index() - 1) {
        $('.preview-border').removeClass('show');
        $('#track-area .track-wrap-highlight').css('background-image', 'url(assets/tracks/track-' + ($(el.target).index() % track_length) + '.png')
        $('#track-area').removeClass('big');
        prevIndex = -1;
    } else {
        $('.preview-border').addClass('show');

        prevIndex = $(el.target).index() - 1;
        console.log('move border to ', prevIndex, $(el.target).position());
        $('.preview-border').css('top', $(el.target).position().top);
        $('.preview-border').css('left', $(el.target).position().left);
        $('.preview-border').css('width', $(el.target).width() - 2);
        $('.preview-border').css('height', $(el.target).height() - 2);

        $('#track-area').addClass('big');
        $('#track-area .track-wrap-highlight').addClass('show');
        $('#track-area .track-wrap-highlight').css('background-image', 'url(' + tracks[prevIndex].imgFull + ')');
    }
});

$('.next').click(function() {

    toggleVisibility();
    //override right bar display
    $('#right-bar').css('opacity', '0');

    setTimeout(() => {
        console.log('redirect auslosung');
        window.location = 'chooser.html';
    }, 500);
});


//initial visibility of page elements
setTimeout(toggleVisibility, 500);

function toggleVisibility() {
    $('#all-tracks, #top-left-image, #top-right-image, #track-area').toggleClass('initial-display');
}