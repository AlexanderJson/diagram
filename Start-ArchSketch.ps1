$ErrorActionPreference = 'Stop'

$nodeCommand = Get-Command node -ErrorAction SilentlyContinue
$nodePath = if ($nodeCommand) {
    $nodeCommand.Source
} else {
    'C:\Users\Alexa\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe'
}

if (-not (Test-Path -LiteralPath $nodePath)) {
    throw 'Node.js was not found. Install Node.js LTS, then run this script again.'
}

$vitePath = Join-Path $PSScriptRoot 'node_modules\vite\bin\vite.js'
if (-not (Test-Path -LiteralPath $vitePath)) {
    throw 'Dependencies are missing. Run pnpm install from this project folder first.'
}

& $nodePath $vitePath --host 127.0.0.1
