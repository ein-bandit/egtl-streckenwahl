var highlightStartDelay = 50; //start time. add gets added erery step
var highlightAddMS = 50; //reduce step (calculated dynamically)
var highlightThreshold = 800; //minimum next image time;

var waitUnhighlight = 500;
var waitReHighlight = 500;


var alltracks = JSON.parse(localStorage.getItem('trackChooser')).tracks;
var selectableTracks = JSON.parse(localStorage.getItem('trackChooser')).choosableTrackIndices;

var availableTracks;
//pull track objects from all tracks by indices
if (selectableTracks.length === 0) {
    console.warn("no tracks selected, choosing from all tracks", alltracks.length);
    availableTracks = alltracks;
} else {
    availableTracks = alltracks.filter(function(track, index) {
        return selectableTracks.includes(index);
    });
    console.log("choosing from tracks", availableTracks.length, availableTracks);
}

availableTrackIndices = getArrayWithIndices(availableTracks);
console.log(availableTrackIndices);

if (availableTracks.length < 6) {
    $('.choose-btn-wrapper').removeClass('show');
    alert('You have selected to few tracks. Select at least 6 tracks from the overview page.');

    setTimeout(function() {
        window.location = 'overview.html';
    }, 1000);

}

//refactor tracks.

var chosenTracks = [];

var running = null;

var round = -1;

for (var i = 0; i < availableTracks.length; i++) {

    var wrap = document.createElement('div');
    wrap.classList = 'track-wrap track-wrap-' + i;

    var img = document.createElement('img');
    img.id = availableTracks[i].id;
    img.src = availableTracks[i].imgThumb;
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

var running;
var lastTrack = -1;
var lastAvailableIndex = -1;
$('.choose-btn-wrapper').click(function() {

    if (running) {
        console.error("already choosing");
        return;
    }

    $('#track-area-' + round + ' .redraw').removeClass('show');

    round = chosenTracks.length;
    running = true;

    //prepare next track area: only if last available index is present, so it is no repeat round.
    if (lastAvailableIndex > -1) {
        //remove last chosen index from available.
        availableTrackIndices.splice(lastAvailableIndex, 1);
        //delete all chosen tracks from next track-area
        for (var i = 0; i < chosenTracks.length; i++) {
            var chosenTrack = chosenTracks[i];
            $('#track-area-' + round + ' > .track-wrap-' + chosenTrack).remove();
        }
    }

    console.log("chosen", chosenTracks);
    console.log("available tracks", availableTrackIndices);

    $('#track-area').css('display', 'none');

    $('#track-area-' + round + ' .choose-btn-wrapper').removeClass('show');

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

    console.log("chosen track index: ", randomTrack);

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

        $('#track-area-' + round + ' .redraw').addClass('show');
        $('#track-area-' + (round + 1) + ' .choose-btn-wrapper').addClass('show');

        console.log('chosen:', chosenTracks);
    });

});

$('.track-area .redraw').click(function(el) {

    //redraw clicked.
    if (!$(el.target).hasClass('show')) return;

    //remove redraw button.
    $(this).removeClass('show');
    //reset displayed track
    $('#track-area-' + round + ' .track-wrap.show').removeClass('show');
    //remove element from chosen
    chosenTracks.splice(chosenTracks.length - 1, 1);

    //reset chosen index.
    lastAvailableIndex = -1;

    //reset dice button.
    $('#track-area-' + round + ' .choose-btn-wrapper').addClass('show');
    $('#track-area-' + (round + 1) + ' .choose-btn-wrapper').removeClass('show');
    //reset red color of text.
    $('#track-area-' + round + ' p').removeClass('chosen');
});



function doubleHighlight(index, cb) {
    $('#track-area-' + round).addClass('highlighted');

    setTimeout(function() {
        $('#track-area-' + round).removeClass('highlighted');
        setTimeout(function() {
            console.log('track-wrap-', index - 1);
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

function getArrayWithIndices(arr) {
    return Array.from(arr.map(function(o, i) {
        return i;
    }));
}

//initial visibility of page elements
if (availableTracks.length >= 6) {
    setTimeout(toggleVisibility, 500);
}

function toggleVisibility() {
    $('#top-left-image, #top-right-image, .track-area').toggleClass('initial-display');
}