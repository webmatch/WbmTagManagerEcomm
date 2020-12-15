#!/usr/bin/env bash

commit=$1
THIS_DIR=pwd;
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
composer install --no-dev -n -o -d WbmTagManagerEcomm
zip -r WbmTagManagerEcomm-${commit}.zip WbmTagManagerEcomm -x WbmTagManagerEcomm/bin WbmTagManagerEcomm/.travis.yml WbmTagManagerEcomm/build.sh WbmTagManagerEcomm/.eslintignore WbmTagManagerEcomm/phpstan.neon.dist WbmTagManagerEcomm/psalm.xml WbmTagManagerEcomm/.gitignore WbmTagManagerEcomm/.git/
