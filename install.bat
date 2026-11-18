@echo off
setlocal enabledelayedexpansion
title Aguickore - Instalar dependencias
chcp 65001 >nul
cls

cd /d "%~dp0"

rem --- Asegurar que pnpm este disponible ---
where pnpm >nul 2>nul
if errorlevel 1 (
  echo pnpm no encontrado. Activando con corepack...
  corepack enable >nul 2>nul
  corepack prepare pnpm@10 --activate >nul 2>nul
  where pnpm >nul 2>nul
  if errorlevel 1 (
    echo.
    echo No se pudo activar pnpm. Instalalo manualmente con:
    echo   npm install -g pnpm@10
    echo.
    pause
    exit /b 1
  )
)

echo ================================
echo   Aguickore - Instalar dependencias
echo ================================
echo.
echo [1/2] Instalando dependencias del monorepo (pnpm workspaces)...
echo.
call pnpm install
if errorlevel 1 (
  echo.
  echo ERROR: pnpm install fallo.
  pause
  exit /b 1
)

echo.
echo [2/2] Compilando paquetes del workspace (necesario para el Dojo)...
echo.

set "PKGS="
set "PKGS=!PKGS! sdks\typescript\packages\core"
set "PKGS=!PKGS! sdks\typescript\packages\client"
set "PKGS=!PKGS! sdks\typescript\packages\encoder"
set "PKGS=!PKGS! sdks\typescript\packages\proto"
set "PKGS=!PKGS! sdks\typescript\packages\a2ui-toolkit"
set "PKGS=!PKGS! middlewares\a2a-middleware"
set "PKGS=!PKGS! middlewares\a2ui-middleware"
set "PKGS=!PKGS! middlewares\middleware-starter"
set "PKGS=!PKGS! middlewares\event-throttle-middleware"
set "PKGS=!PKGS! middlewares\mcp-apps-middleware"
set "PKGS=!PKGS! middlewares\mcp-middleware"
set "PKGS=!PKGS! integrations\a2a\typescript"
set "PKGS=!PKGS! integrations\adk-middleware\typescript"
set "PKGS=!PKGS! integrations\adk-middleware\js"
set "PKGS=!PKGS! integrations\adk-middleware\js\examples"
set "PKGS=!PKGS! integrations\ag2\typescript"
set "PKGS=!PKGS! integrations\agno\typescript"
set "PKGS=!PKGS! integrations\antigravity\typescript"
set "PKGS=!PKGS! integrations\aws-strands\typescript"
set "PKGS=!PKGS! integrations\claude-agent-sdk\typescript"
set "PKGS=!PKGS! integrations\claude-managed-agents\typescript"
set "PKGS=!PKGS! integrations\community\cloudflare-agents\typescript"
set "PKGS=!PKGS! integrations\community\cloudflare-agents\typescript\examples"
set "PKGS=!PKGS! integrations\community\omnara\typescript"
set "PKGS=!PKGS! integrations\community\spring-ai\typescript"
set "PKGS=!PKGS! integrations\crew-ai\typescript"
set "PKGS=!PKGS! integrations\langchain\typescript"
set "PKGS=!PKGS! integrations\langgraph\typescript"
set "PKGS=!PKGS! integrations\langroid\typescript"
set "PKGS=!PKGS! integrations\llama-index\typescript"
set "PKGS=!PKGS! integrations\mastra\typescript"
set "PKGS=!PKGS! integrations\openai-agents\typescript"
set "PKGS=!PKGS! integrations\pydantic-ai\typescript"
set "PKGS=!PKGS! integrations\server-starter\typescript"
set "PKGS=!PKGS! integrations\server-starter-all-features\typescript"
set "PKGS=!PKGS! integrations\vercel-ai-sdk\typescript"
set "PKGS=!PKGS! integrations\watsonx\typescript"
set "PKGS=!PKGS! spec"

set "FAILED="
for %%p in (!PKGS!) do (
  if exist "%%p\package.json" (
    echo   - %%p
    pushd "%%p" >nul
    call pnpm run build >nul 2>&1
    if errorlevel 1 (
      echo     [AVISO] Fallo la compilacion de %%p
      set "FAILED=!FAILED! %%p"
    )
    popd >nul
  )
)

echo.
if defined FAILED (
  echo Compilacion completada con avisos en:%FAILED%
) else (
  echo Compilacion completada correctamente.
)
echo.
echo Instalacion finalizada. Ya puedes ejecutar run.bat
echo.
pause
endlocal
