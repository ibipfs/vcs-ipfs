echo Commit message?
read msg
git add -A
git commit -m "$msg"
git push origin master
