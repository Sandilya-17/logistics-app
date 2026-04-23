@echo off
title Building Backend JAR
color 0E
echo.
echo  Building backend... (this takes about 2 minutes, only done once)
echo.
cd /d "%~dp0backend"
call mvn clean package -DskipTests
if errorlevel 1 (
    echo.
    echo  [ERROR] Build failed. Make sure Java 17+ and Maven are installed.
    echo.
    echo  Download Java 17: https://adoptium.net/temurin/releases/?version=17
    echo  Download Maven:   https://maven.apache.org/download.cgi
    echo.
) else (
    echo.
    echo  Build successful! You can now run START-WINDOWS.bat
    echo.
)
pause
