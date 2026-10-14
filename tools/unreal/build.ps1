[CmdletBinding()]
param(
    [Parameter(Mandatory = $true)][string]$EngineRoot,
    [ValidateSet('Development', 'Shipping')][string]$Configuration = 'Development',
    [string]$OutputDirectory = '',
    [switch]$PrepareOnly,
    [switch]$AllowDifferentEngine
)
$ErrorActionPreference = 'Stop'
Set-StrictMode -Version Latest
$Repo = (Resolve-Path (Join-Path $PSScriptRoot '../..')).Path
$ProjectDirectory = Join-Path $Repo 'native/DividedHorizon'
$Project = Join-Path $ProjectDirectory 'DividedHorizon.uproject'
$EngineRoot = (Resolve-Path $EngineRoot).Path
if ($env:OS -ne 'Windows_NT') { throw 'This script requires a Windows UE5 build host. It is not a Linux cross-compiler.' }
if (-not $OutputDirectory) { $OutputDirectory = Join-Path $Repo 'artifacts/DividedHorizon-Win64' }
$OutputDirectory = [System.IO.Path]::GetFullPath($OutputDirectory)
$Build = Join-Path $EngineRoot 'Engine/Build/BatchFiles/Build.bat'
$Editor = Join-Path $EngineRoot 'Engine/Binaries/Win64/UnrealEditor-Cmd.exe'
$UAT = Join-Path $EngineRoot 'Engine/Build/BatchFiles/RunUAT.bat'
foreach ($File in @($Build, $Editor, $UAT, (Join-Path $EngineRoot 'Engine/Build/Build.version'))) {
    if (-not (Test-Path $File)) { throw "Required UE installation file not found: $File" }
}
$Version = Get-Content (Join-Path $EngineRoot 'Engine/Build/Build.version') -Raw | ConvertFrom-Json
if (($Version.MajorVersion -ne 5 -or $Version.MinorVersion -ne 6) -and -not $AllowDifferentEngine) {
    throw 'This unverified source baseline targets UE 5.6. Use -AllowDifferentEngine only after reviewing compatibility and the target rules.'
}
if (-not (Get-Command node -ErrorAction SilentlyContinue)) { throw 'Node.js 22.12+ is required for the source-asset conversion.' }
if (-not (Test-Path (Join-Path $Repo 'node_modules/three/package.json'))) { throw 'Run npm ci at the repository root first.' }
function Invoke-Checked([string]$Program, [string[]]$Arguments) {
    & $Program @Arguments
    if ($LASTEXITCODE -ne 0) { throw "Command failed ($LASTEXITCODE): $Program" }
}
Push-Location $Repo
try {
    Invoke-Checked 'node' @('tools/unreal/export_native.mjs')
    Invoke-Checked $Build @('DividedHorizonEditor', 'Win64', 'Development', "-Project=$Project", '-WaitMutex', '-NoHotReloadFromIDE')
    $Marker = Join-Path $ProjectDirectory 'Saved/DHContentPrepared.json'
    if (Test-Path $Marker) { Remove-Item $Marker } # A previous success cannot hide a failed preparation.
    Invoke-Checked $Editor @($Project, "-ExecutePythonScript=$(Join-Path $PSScriptRoot 'prepare_editor.py')", '-unattended', '-nosplash', '-nosound', '-stdout', '-FullStdOutLogOutput')
    if (-not (Test-Path $Marker)) {
        throw 'Editor preparation did not produce a success marker. Read Saved/DHContentPreparationFailure.log and Saved/Logs/.'
    }
    if ($PrepareOnly) {
        Write-Host 'Editor target compiled and generated map/materials saved. Open the project and run the native test checklist before packaging.'
        return
    }
    Invoke-Checked $UAT @('BuildCookRun', "-project=$Project", '-noP4', '-platform=Win64', "-clientconfig=$Configuration", '-build', '-cook', '-map=/Game/Maps/L_PuertoChico', '-stage', '-pak', '-archive', "-archivedirectory=$OutputDirectory", '-prereqs', '-utf8output', '-unattended')
    $Executables = @(Get-ChildItem $OutputDirectory -Recurse -Filter 'DividedHorizon.exe' -File)
    $Paks = @(Get-ChildItem $OutputDirectory -Recurse -Filter '*.pak' -File)
    if ($Executables.Count -eq 0 -or $Paks.Count -eq 0) { throw 'UAT returned without the expected executable or cooked pak content.' }
    $Docs = Join-Path $OutputDirectory 'DeliveryNotes'
    New-Item -ItemType Directory -Force $Docs | Out-Null
    Copy-Item (Join-Path $Repo 'docs/NATIVE_PROTOTYPE.md') (Join-Path $Docs 'README_PLAYER.md')
    Copy-Item (Join-Path $Repo 'docs/LICENSES.md') $Docs
    @{ status = 'PACKAGED_NOT_LAUNCH_VERIFIED'; configuration = $Configuration;
       engine = "$($Version.MajorVersion).$($Version.MinorVersion).$($Version.PatchVersion)";
       executable = $Executables[0].FullName; codeSigned = $false;
       note = 'No clean-machine launch, gameplay, GPU performance, or security certification is implied.'
    } | ConvertTo-Json | Set-Content (Join-Path $OutputDirectory 'BUILD_RECEIPT.json')
    Get-ChildItem $OutputDirectory -Recurse -File | Where-Object { $_.Name -ne 'SHA256SUMS.csv' } |
        ForEach-Object { $Hash = Get-FileHash $_.FullName -Algorithm SHA256;
            [PSCustomObject]@{ Path = $_.FullName.Substring($OutputDirectory.Length + 1); SHA256 = $Hash.Hash }
        } | Export-Csv -NoTypeInformation (Join-Path $OutputDirectory 'SHA256SUMS.csv')
    Write-Host "Packaged files: $OutputDirectory"
    Write-Host 'NOT YET LAUNCH-VERIFIED. Test the complete directory on Windows; do not distribute only the .exe.'
}
finally { Pop-Location }
