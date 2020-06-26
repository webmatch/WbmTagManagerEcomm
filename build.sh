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
zip -r WbmTagManagerEcomm-${commit}.zip WbmTagManagerEcomm \
--exclude="WbmTagManagerEcomm/bin/*" \
--exclude="WbmTagManagerEcomm/.travis.yml" \
--exclude="WbmTagManagerEcomm/build.sh" \
--exclude="WbmTagManagerEcomm/.eslintignore" \
--exclude="WbmTagManagerEcomm/phpstan.neon.dist" \
--exclude="WbmTagManagerEcomm/psalm.xml" \
--exclude="WbmTagManagerEcomm-/CHANGELOG.md"