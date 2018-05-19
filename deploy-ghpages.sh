#!/bin/sh

# abort the script if there is a non-zero error
set -e

# show where we are on the machine
pwd
remote=$(git config remote.origin.url)

# now lets setup a new repo so we can update the gh-pages branch
git config --global user.email "$GH_EMAIL" > /dev/null 2>&1
git config --global user.name "$GH_NAME" > /dev/null 2>&1

git add app && git commit -m "Initial app subtree commit"
git subtree push --prefix app origin gh-pages

git checkout gh-pages
git merge master --no-edit
npm install && npm run-script build


git add .
git commit -m "building into gh-pages `date`"
git push

echo "Finished Deployment!"