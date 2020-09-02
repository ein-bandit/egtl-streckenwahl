const sharp = require('sharp');

for (var i = 0; i < 75; i++) {
    let originalImage = `assets/tracks/track-${i+1}.png`;
    let outputImage = `assets/tracks/thumbs/track-${i+1}-thumb.png`;

    sharp(originalImage).extract({ width: 352, height: 416, left: 0, top: 0 }).toFile(outputImage)
        .then(function(new_file_info) {
            console.log("Image cropped and saved", new_file_info);
        })
        .catch(function(err) {
            console.log("An error occured", err);
        });

}