#!/bin/sh

# abort the script if there is a non-zero error
set -e

# show where we are on the machine
pwd

if git diff-index --quiet HEAD --
then
  # no changes
  echo "No changes."
else
  git add app && git commit -m "Initial app subtree commit"
  git subtree push --prefix app origin gh-pages
fi

echo "Finished Deployment!"