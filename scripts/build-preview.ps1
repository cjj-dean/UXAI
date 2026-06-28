$ErrorActionPreference = "Stop"

$repoRoot = Split-Path $PSScriptRoot -Parent
$vueProject = "$repoRoot\packages\app\octoapp\pages\pattern\vue-project"
$previewDist = "$repoRoot\packages\previewdist"

if (-not (Test-Path "$vueProject\src\jsonStorage\icon.json")) {
    Set-Content -LiteralPath "$vueProject\src\jsonStorage\icon.json" -Value '{}' -Encoding UTF8
}

if (-not (Test-Path "$vueProject\node_modules")) {
    Write-Host "[build-preview] Installing dependencies..."
    Push-Location $vueProject
    npm install
    Pop-Location
}

Write-Host "[build-preview] Building vue-project..."
Push-Location $vueProject
npx vite build
if (-not $?) { throw "vite build failed" }
Pop-Location

Write-Host "[build-preview] Copying dist -> previewdist..."
Remove-Item -Path "$previewDist\assets\*" -Force -ErrorAction SilentlyContinue
Copy-Item -Path "$vueProject\dist\*" -Destination $previewDist -Recurse -Force

Write-Host "[build-preview] Done."
