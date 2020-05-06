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

tested with Node v9.5.0 - other versions may work as well

1 - clone repository
2 - run `npm install`
3 - start app via `npm start`

# Develepment

You can view the app and it's pages in a web browsers for development.
No local web server needed.
Best use is Google Chrome, since electron also uses a Chromium version to display the pages.

Changes in styling need to be checked with electron app before committing.
Stylings are optimized for the electorn app, so look and feel may be slightly out of place when viewed with a standard webbrowser.

# Future plans

- clean and merge script files
- migrate to vue.js
- make branding customizable
- extend with additional features
    - dynamic number of tracks
    - random choosement of track time
    - support more/all tracks
