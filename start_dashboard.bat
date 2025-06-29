@echo off
echo.
echo  ================================================
echo      STARTING CSPGCL DASHBOARD APPLICATION
echo  ================================================
echo.

echo  [1/3] Starting Backend Server in a new window...
REM This opens a new window, goes into your Backend folder, and runs the server.
start "CSPGCL Backend Server" cmd /k "cd Backend && node server.js"

echo  [2/3] Waiting 5 seconds for the server to initialize...
timeout /t 5 /nobreak > nul

echo  [3/3] Opening Dashboard in your web browser...

REM --- THE FIX IS HERE ---
REM The empty double quotes "" before the path are important for handling spaces.
REM This will try to open 'index.html' first.
start "" "Frontend\index.html"

REM If the first one fails, this will try to open your original filename.
REM One of these two lines will work. The other will give a small, harmless error.
start "" "Frontend\Cspgcl Dashboard.html"


echo.
echo  SUCCESS! The dashboard should be running.
echo  To stop the server, close the new black window.
echo.
pause