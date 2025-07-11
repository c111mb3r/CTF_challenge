#!/bin/bash

while true; do
  cd /home/mythos && plackup -p 1339 bin/app.psgi
done
