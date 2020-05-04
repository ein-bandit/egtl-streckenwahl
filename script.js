
var track_length = 8;
var highlightStartDelay = 100; //start time. add gets added erery step
var highlightAddMS = 50;     //reduce step 
var highlightThreshold = 1000; //minimum next image time;
var tracks = [];

var chosenTracks = [];

var availableTrackIndices = [];

var running = null;

var round = -1;

for (var i = 0; i < track_length; i++) {
	tracks.push({
		img: 'tracks/track-' + (i+1) + '.png',
		id: 'track-'+i
	});
	availableTrackIndices.push(i);

		var wrap = document.createElement('div');
	wrap.classList = 'track-wrap track-wrap-'+i;

	var img = document.createElement('img');
	img.id = tracks[i].id;
	img.src = tracks[i].img;
	img.classList= ['track-image']
		
	wrap.appendChild(img);
	document.getElementById('track-area').appendChild(wrap);
}

//fill choosing track areas
for (var t = 0; t < 6; t++) {
	$('#track-area').clone().attr('id', 'track-area-'+t).addClass('track-area').appendTo('.track-areas');
}

$('.track-areas-display').css('display','none');

var running;
document.getElementById('choose-btn').addEventListener('click', function() {

	$('#track-area').css('display','none');

	round = chosenTracks.length;

	$('.track-wrap-highlight').removeClass('highlighted');
	$('#track-area-'+round+' .track-wrap').removeClass('show');

	//get random trackIndex
	var selectTrack = Math.floor(Math.random() * Math.floor(availableTrackIndices.length -1));
	chosenTracks.push(selectTrack);
	console.log("selecting image", selectTrack + 1, 'index:', selectTrack);

	if (running) {
		console.error("already choosing");
		return;
	}

	running = true;
	//highlightImage(selectTrack);

	highlightSequence(0, (2*tracks.length) + selectTrack + 1, highlightStartDelay);	

	availableTrackIndices.splice(availableTrackIndices[selectTrack], 1);
	running = false;

	console.log('available:',availableTrackIndices);
	console.log('chosen:', chosenTracks);
});



function doubleHighlight(index, waitUnhighlight, waitReHighlight) {
		$('#track-area-'+round+' .track-wrap-highlight').addClass('highlighted');

	setTimeout(function() {
		$('#track-area-'+round+' .track-wrap-highlight').removeClass('highlighted');
		setTimeout(function() {
			console.log('track-wrap-',index);
			$('#track-area-'+round+' .track-wrap-highlight').addClass('highlighted');
			setTimeout(function() {
				$('#track-area-'+round+' .track-wrap-highlight').removeClass('highlighted');
			}, waitReHighlight || 500);
		}, waitReHighlight || 500);
	}, waitUnhighlight || 500);
}

function highlightImage(index) {
	unHighlightAll();
	console.log("highlighting",'#track-area-'+round+' .track-wrap-'+index);
	$('#track-area-'+round+' .track-wrap-'+index).addClass('show');
}

function unHighlightAll() {
	$('#track-area-'+round+' .track-wrap').removeClass('show');
}

function unHighlightImage(index) {
	$('#track-area-'+round+' .track-wrap-'+index).removeClass('show');
}

function disableSelectedTrackDelayed(index, delay) {

	setTimeout(function() {
		$('#track-area-'+round+' .track-wrap-'+index).addClass('disabled');
	}, delay || 1000);
}

function highlightSequence(runner, max, delay) {
	if (runner === max) {
		console.log("trigger double highlight");
		doubleHighlight(runner % tracks.length);		
		return;
	}
	highlightImage(runner % tracks.length);
	
	//start next sequence
	setTimeout(function() {
		highlightSequence(runner+1, max, 
			delay < highlightThreshold ? delay+highlightAddMS : delay);
	}, delay);

}