#!/bin/sh

# abort the script if there is a non-zero error
set -e

# show where we are on the machine
pwd
remote=$(git config remote.origin.url)

git add app && git commit -m "Initial app subtree commit" > /dev/null 2>&1
git subtree push --prefix app origin gh-pages > /dev/null 2>&1

echo "Finished Deployment!"