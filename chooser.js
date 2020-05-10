var track_length = 22;
var highlightStartDelay = 50; //start time. add gets added erery step
var highlightAddMS = 50; //reduce step (calculated dynamically)
var highlightThreshold = 800; //minimum next image time;
var tracks = [];

var waitUnhighlight = 500;
var waitReHighlight = 500;

var chosenTracks = [];

var availableTrackIndices = [];

var running = null;

var round = -1;

for (var i = 0; i < track_length; i++) {
    tracks.push({
        img: 'assets/tracks/thumbs/track-' + (i + 1) + '-thumb.png',
        id: 'track-' + i
    });
    availableTrackIndices.push(i);

    var wrap = document.createElement('div');
    wrap.classList = 'track-wrap track-wrap-' + i;

    var img = document.createElement('img');
    img.id = tracks[i].id;
    img.src = tracks[i].img;
    img.classList = ['track-image']

    wrap.appendChild(img);
    document.getElementById('track-area').appendChild(wrap);
}

//fill choosing track areas
for (var t = 0; t < 6; t++) {
    $('#track-area').clone().attr('id', 'track-area-' + t).addClass('track-area').appendTo('.track-areas');
    $('#track-area-' + t).children('p').text('R' + (t + 1));
    $('#track-area-' + t + ' .choose-btn-wrapper').css('background-image', 'url(assets/dice-' + (t + 1) + '.svg)');
}

$('.track-areas-display').css('display', 'none');

//activate first choose button
$('#track-area-0 .choose-btn-wrapper').addClass('show');

//print array to console once.
console.log(availableTrackIndices);

var running;
var lastTrack = -1;
var lastAvailableIndex = -1;
$('.choose-btn-wrapper').click(function() {

    if (running) {
        console.error("already choosing");
        return;
    }

    round = chosenTracks.length;
    running = true;

    $('#track-area').css('display', 'none');

    $('#track-area-' + round + ' .choose-btn-wrapper').css('display', 'none');

    $('.track-wrap-highlight').removeClass('highlighted');
    $('#track-area-' + round + ' .track-wrap').removeClass('show');



    //get an index from all available indices.
    var randomAvailableIndex = Math.floor(Math.random() * Math.floor(availableTrackIndices.length - 1));
    //use random index to get the track index.
    var randomTrack = availableTrackIndices[randomAvailableIndex];
    chosenTracks.push(randomTrack);

    //store indices for div deletion after highlighting.
    lastTrack = randomTrack;
    lastAvailableIndex = randomAvailableIndex;

    console.log("chosen track index: ", randomTrack, ", it is track-" + (parseInt(randomTrack) + 1));

    //highlightImage(selectTrack);

    //start this code when selection / highlighting is finished.

    promise = new Promise(function(resolve) {
        $('#track-area-' + round + ' p').addClass('chosen');
        var steps = availableTrackIndices.length + randomAvailableIndex + 1;
        console.log("steps: ", steps);
        //-3 last three images should have max time
        highlightAddMS = (highlightThreshold - highlightStartDelay) / (steps - 3);
        highlightSequence(0, steps, highlightStartDelay, resolve);
    });

    promise.then(function() {
        running = false;
        $('#track-area-' + (round + 1) + ' .choose-btn-wrapper').addClass('show');
        //delete all chosen tracks from other areas
        for (var i = round + 1; i < 6; i++) {
            $('#track-area-' + i + ' > .track-wrap-' + lastTrack).remove();
        }
        lastTrack = -1;
        availableTrackIndices.splice(lastAvailableIndex, 1);
        lastAvailableIndex = -1;
        console.log('chosen:', chosenTracks);
        console.log('available:', availableTrackIndices);
    });

});



function doubleHighlight(index, cb) {
    $('#track-area-' + round).addClass('highlighted');

    setTimeout(function() {
        $('#track-area-' + round).removeClass('highlighted');
        setTimeout(function() {
            console.log('track-wrap-', index);
            $('#track-area-' + round).addClass('highlighted');
            setTimeout(function() {
                $('#track-area-' + round).removeClass('highlighted');
                cb();
            }, waitReHighlight);
        }, waitReHighlight);
    }, waitUnhighlight);
}

function highlightImage(index) {
    unHighlightAll();
    //console.log("highlighting", '#track-area-' + round + ' .track-wrap-' + index);
    $('#track-area-' + round + ' .track-wrap-' + index).addClass('show');
}

function unHighlightAll() {
    $('#track-area-' + round + ' .track-wrap').removeClass('show');
}

function unHighlightImage(index) {
    $('#track-area-' + round + ' .track-wrap-' + index).removeClass('show');
}

function disableSelectedTrackDelayed(index, delay) {

    setTimeout(function() {
        $('#track-area-' + round + ' .track-wrap-' + index).addClass('disabled');
    }, delay || 1000);
}

function highlightSequence(runner, max, delay, resolve) {

    if (runner === max) {
        console.log("trigger double highlight");
        doubleHighlight(availableTrackIndices[runner % availableTrackIndices.length], resolve);
        return;
    }
    highlightImage(availableTrackIndices[runner % availableTrackIndices.length]);

    //start next sequence
    setTimeout(function() {
        highlightSequence(runner + 1, max,
            delay < highlightThreshold ? delay + highlightAddMS : delay, resolve);
    }, delay);

}

//initial visibility of page elements
setTimeout(toggleVisibility, 500);

function toggleVisibility() {
    $('#top-left-image, #top-right-image, .track-area').toggleClass('initial-display');
}