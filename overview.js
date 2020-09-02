var tracks = JSON.parse(localStorage.getItem('trackChooser')).tracks;
var selectableTracks = JSON.parse(localStorage.getItem('trackChooser')).choosableTrackIndices;

for (var i = 0; i < tracks.length; i++) {

    var previewWrap = document.createElement('div');
    previewWrap.classList = 'preview-track preview-track-' + i;

    $(previewWrap).css('background-image', 'url(' + tracks[i].imgThumb + ')');

    var check = document.createElement('div');
    check.classList = 'check';

    previewWrap.appendChild(check);

    var checkmark = document.createElement('div');
    checkmark.classList = 'checkmark';
    checkmark.innerHTML = 'L';
    check.appendChild(checkmark);

    document.getElementById('all-tracks').appendChild(previewWrap);
}

//mark initial selected tracks.
selectableTracks.forEach(function(elem) {
    $('.preview-track-' + elem).children('.check').addClass('checked');
});

$('p.selected > span').text(selectableTracks.length);

var pages = Math.ceil(tracks.length / 8);
console.log("pages", pages, tracks.length);
var currentPage = 0;

var slider = new Siema({
    selector: '#all-tracks',
    duration: 200,
    easing: 'ease-out',
    perPage: 8,
    startIndex: 0,
    draggable: false,
    multipleDrag: false,
    threshold: 20,
    loop: false,
    rtl: false,
    onInit: () => {},
    onChange: () => {},
});

function updateSliderText() {
    $('.slider-text .text').text(`${currentPage + 1} / ${pages}`);
}

setTimeout(() => {

    $('#all-tracks').append('<div class="preview-border"></div>');
    $('#all-tracks-wrapper').append('<div class="slider-text"><div class="text"></div></div>');
    updateSliderText();
    setTimeout(() => {
        $('.slider-text').append('<div class="prev">&lt;</div><div class="next">&gt;</div>');

        $('.slider-text .next').click(function(el) {
            $('.preview-track-' + prevIndex).trigger('click').trigger('mouseout');

            if (currentPage === pages - 1) {
                return;
            }
            currentPage += 1;
            updateSliderText();
            slider.next(8);
        });
        $('.slider-text .prev').click(function(el) {
            $('.preview-track-' + prevIndex).trigger('click').trigger('mouseout');

            if (currentPage === 0) {
                return;
            }
            currentPage -= 1;
            updateSliderText();
            slider.prev(8);
        });
    }, 0);

}, 0);

var prevIndex = -1;
var hovering = false;

//preview track hover: show small image
$('.preview-track').mouseover(function(el) {
    if (prevIndex > -1) {
        return;
    }

    hovering = true;
    $('.track-wrap').addClass('show');
    $('#track-area .track-wrap-highlight').css('background-image', 'url(' + tracks[$(el.target).parent().index()].imgThumb + ')');
}).mouseout(function(el) {
    if (prevIndex > -1) {
        return;
    }
    hovering = false;
    $('.track-wrap').removeClass('show');
    setTimeout(() => {
        if (!hovering) {
            $('#track-area .track-wrap-highlight').css('background-image', '')
        }
    }, 500);
});

window.addEventListener('contextmenu', function(e) {
    e.preventDefault();
});
//preview track click: show big image.
$('.preview-track').mousedown(function(evt) {

    switch (evt.which) {
        case 1:
            previewClickLeft(evt.target);
            break;
        case 3:
            previewClickRight(evt.target);
            break;
    }
});

function previewClickRight(target) {

    // if inserted remove it.
    console.log("clicked right");
    //add element to availableindices.
    console.log(target);

    toggleElementToSelectableTracksAndSave($(target).parent().index());

    //activate green mark on image.
    console.log(selectableTracks.length);
    $('p.selected > span').text(selectableTracks.length);

    $(target).children('.check').toggleClass('checked');
}
//preview clicked left
function previewClickLeft(target) {
    var elem = $(target).parent();
    if (prevIndex === elem.index()) {
        $('.preview-border').removeClass('show');
        $('#track-area').css('width', '');
        $('#track-area').removeClass('big');
        prevIndex = -1;
        setTimeout(() => {
            $('#track-area .track-wrap-highlight').css('background-image', 'url(assets/tracks/thumbs/track-' + (elem.index() + 1) + '-thumb.png')
        }, 250);
    } else {
        $('.preview-border').addClass('show');

        prevIndex = elem.index();
        var rect = target.getBoundingClientRect();
        $('.preview-border').css('top', 0);
        $('.preview-border').css('left', rect.left);
        //dirty hack to show border on last track completely.
        var extra = ((prevIndex % 8) === 7) || (prevIndex === tracks.length - 1) ? 2 : 0;
        $('.preview-border').css('width', (elem.width() - 2) - extra);
        $('.preview-border').css('height', elem.height() - 4);

        $('#track-area').addClass('big');
        $('#track-area .track-wrap-highlight').addClass('show');

        $('#track-area .track-wrap-highlight').css('background-image', 'url(' + tracks[prevIndex].img + ')');
        //another dirty hack to adjust width of highlight wrap.
        imgdim();
    }
}

function toggleElementToSelectableTracksAndSave(index) {
    console.log("persisting element with index", index);
    if (selectableTracks.includes(index)) {
        selectableTracks = selectableTracks.filter(function(o) {
            return o !== index;
        });
    } else {
        selectableTracks.push(index);
    }

    localStorage.setItem('trackChooser', JSON.stringify({
        tracks: tracks,
        choosableTrackIndices: selectableTracks
    }));
    console.log(JSON.parse(localStorage.getItem('trackChooser')));
}

function imgdim() {
    var imageSrc = $('#track-area .track-wrap-highlight')[0]
        .style
        .backgroundImage
        .replace(/url\((['"])?(.*?)\1\)/gi, '$2')
        .split(',')[0];

    var image = new Image();
    image.src = imageSrc;
    image.onload = function() {
        var width = image.width,
            height = image.height;
        var ratio = width / height;
        $('#track-area').css('width', 356 * ratio);
    }

}

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
    $('#all-tracks, #top-left-image, #top-right-image, #track-area, .slider-text, p').toggleClass('initial-display');
}
setTimeout(function() {
    $('p.text').removeClass('initial-display').addClass('visible');
    $('p.text').fadeOut(500);
}, 3500);