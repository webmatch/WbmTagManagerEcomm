#!/usr/bin/env bash

commit=$1
if [ -z ${commit} ]; then
    commit=$(git tag | tail -n 1)
    if [ -z ${commit} ]; then
        commit="master";
    fi
fi

# Remove old release
rm -rf WbmTagManagerEcomm WbmTagManagerEcomm-*.zip

# Build new release
mkdir -p WbmTagManagerEcomm
git archive ${commit} | tar -x -C WbmTagManagerEcomm
composer install --no-dev -n -o -d WbmTagManagerEcomm
zip -r WbmTagManagerEcomm-${commit}.zip WbmTagManagerEcomm