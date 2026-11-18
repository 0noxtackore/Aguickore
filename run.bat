@echo off
setlocal
title Aguickore - Ejecutar proyecto
chcp 65001 >nul
cls

echo ================================
echo   Aguickore / AG-UI - Ejecutar
echo ================================
echo.
echo   Elige que levantar:
echo     1) Documentacion (Mintlify) - docs + mintlify dev
echo     2) Demo Dojo (Next.js)      - apps/dojo + pnpm dev
echo     3) SDK TypeScript            - pnpm dev
echo     4) SDK Python                - uv sync
echo     5) SDK .NET                  - sdks/dotnet + dotnet build
echo     6) SDK Go                    - sdks/community/go + go build
echo.
echo   (Ctrl+C detiene lo que este ejecutando)
echo ================================
echo.

set /p opcion=Escribe tu opcion: 

if "%opcion%"=="1" goto docs
if "%opcion%"=="2" goto dojo
if "%opcion%"=="3" goto ts
if "%opcion%"=="4" goto py
if "%opcion%"=="5" goto net
if "%opcion%"=="6" goto go
if "%opcion%"=="" goto fin

echo Opcion no valida.
goto fin

:docs
echo Ejecutando: mintlify dev
cd /d "%~dp0docs"
mintlify dev
goto fin

:dojo
echo Ejecutando: pnpm dev
cd /d "%~dp0apps\dojo"
pnpm dev
goto fin

:ts
echo Ejecutando: pnpm dev
cd /d "%~dp0"
pnpm dev
goto fin

:py
echo Ejecutando: uv sync
cd /d "%~dp0"
uv sync
goto fin

:net
echo Ejecutando: dotnet build
cd /d "%~dp0sdks/dotnet"
dotnet build
goto fin

:go
echo Ejecutando: go build ./...
cd /d "%~dp0sdks/community/go"
go build ./...
goto fin

:fin
echo.
endlocal
