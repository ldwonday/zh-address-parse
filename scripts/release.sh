set -e
echo "Enter release version: "
read VERSION
echo "Enter commit message: "
read MESSAGE

read -p "Releasing $VERSION - are you sure? (y/n)" -n 1 -r
echo # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "Releasing $VERSION ..."

    npm run build
    npm run build-lib

    git add .
    git commit -m "$MESSAGE"
    git push origin develop

    npm version $VERSION --message "build: $VERSION"
    # commit
    git checkout master
    git merge develop
    git push origin master

    # publish
    git tag $VERSION -m "release: $VERSION"
    git push origin "$VERSION"

    git checkout develop
fi
