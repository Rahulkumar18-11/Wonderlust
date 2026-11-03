@echo off
echo ===================================================
echo  [1/2] Pushing latest files to GitHub (main)...
echo ===================================================
git add -A
git status --short
set /p commit_msg="Enter commit message (or press Enter for 'CI/CD automated update'): "
if "%commit_msg%"=="" set commit_msg=CI/CD automated update
git commit -m "%commit_msg%"
git push origin main

echo ===================================================
echo  [2/2] Files successfully uploaded to GitHub!
echo  CI/CD Pipeline will auto-build on Jenkins:
echo  http://localhost:8080/job/Wonderlust/
echo ===================================================
