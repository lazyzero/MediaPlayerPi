#!/bin/bash
xset -dpms
xset s off
xset s noblank
unclutter &
matchbox-window-manager -use_cursor no -use_titlebar no  &
cd ~/MediaPlayerPi/
node app.js &
midori -e Fullscreen -a http://localhost:3000/screen
