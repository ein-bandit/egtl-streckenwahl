# EGTL Streckenwahl

plain html / js app that selects 6 random tracks.
all tracks and resources derive directly from GT Sport.
this is a prototype for EGTL season planning.

includes 
- an intro page
- a page for track overview
- selection page

wrapped in electron to generate builds for Windows.

# Setup

tested with Node v10.5.0 - newer versions may work as well
10.0.* is minimum due to image preparation library "sharp"
python needs to be installed on your system. additionally you will ned a system variable `PYTHON` pointing to python executable.

1 - clone repository
2 - run `npm install`
3 - start app via `npm start` or open the index.html file in chrome browser

# Development

You can view the app and it's pages in a web browsers for development.
No local web server needed.
Best use is Google Chrome, since electron also uses Chromium internally to display the pages.

Changes in styling need to be checked with electron app before committing.
Stylings are optimized for the electron app, so look and feel may be slightly out of place when viewed with a standard webbrowser.

## Preparing assets
Take a screenshot from GT Sport in Arcade Mode where the track layout and the track times are visible.
Crop the image to around the black border (685px height) and place it in `assets/tracks`.
Run `npm run prepare-images` to create thumbnails used for overview page.

# Future plans

- clean and merge script files
- migrate to vue.js or react
- make branding customizable
- extend with additional features
    - dynamic number of tracks
    - random choosement of track time
    - support more/all tracks
