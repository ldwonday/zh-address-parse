set -e
echo "Enter commit message: "
read MESSAGE

echo "Commit $MESSAGE ..."

# add
git add -A

# npm run lint-staged

# commit
git commit -m "$MESSAGE"
git push origin develop
