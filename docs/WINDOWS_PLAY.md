# DIVIDED HORIZON — Windows combat prototype 0.3.1

## Read before downloading
This is an unfinished raylib 5.5 prototype, NOT the final Unreal game.
The EXE is rebuilt for Windows x64 and the ZIP is checked for required files,
PE architecture and hashes. Windows launch, graphics, input, audio and clean-machine
compatibility have NOT been tested here. No promise of perfect operation is made.

This maintenance release refreshes the package, version label, provenance,
launch/diagnostic helpers and file-completeness checks. It does not add new gameplay,
photoreal assets, a full campaign or Unreal support.

## Start playing
1. Download DIVIDED_HORIZON_Windows_Combat_Slice_0.3.1.zip (NOT the Source ZIP).
2. Right-click the ZIP and choose Extract All. Use a folder you can write to.
3. Open the extracted folder. Run DividedHorizon-Slice.exe or Start-Game.bat.
4. Choose Begin operation. Do not run the executable from inside the ZIP preview.

Keep the complete assets/ folder beside the EXE. The package includes seven GLB
models, six WAV sounds, runtime data, license notices, BUILD_STATUS.json,
SHA256SUMS.txt and Run-Diagnostics.bat. Do not download only the EXE.

Requirements: 64-bit Windows and a GPU/driver that supports OpenGL 3.3.
Windows 10/11 x64 are intended targets, not certified test results.
No Unreal installation, Node.js, Python, account or paid service is required.
Imported runtime DLLs are Windows system libraries. No extra third-party runtime DLL
was detected in the build's import table. Update graphics drivers through the GPU
vendor if needed; do not download random replacement DLLs.

This build is unsigned. Windows may display an unknown-publisher warning. Do not
turn off antivirus/SmartScreen or other security protections to run it. If blocked,
stop and report the exact message. There is no antivirus or code-signing certification.

## Controls
WASD move; mouse look; left mouse/F fire; right mouse aim; R reload;
Shift sprint; Ctrl/C crouch; Space jump; E interact; H heal; 1/2 weapons;
Escape pause; F11 fullscreen.

Recover the cargo manifest, read the ledger in the hut, disable the mast signal,
then return to the south jetty. The manifest unlocks the rifle. Story difficulty
reduces incoming damage. All artwork and animations remain prototypes.

## Save files
Checkpoints normally go to %APPDATA%/DividedHorizonSlice/checkpoint-v2.sav.
Extract updates into a NEW folder to avoid mixing versions. Back up your checkpoint
before replacing it. This release retains checkpoint schema v2; backup is still prudent.

## Troubleshooting and feedback
Run Run-Diagnostics.bat to produce self-test.txt. This tests only a few simulation
operations; even PASS does not verify rendering, audio, input or a complete mission.
A missing-assets message means the complete ZIP was not extracted or files were moved.
For a startup failure, report Windows version, GPU/driver, exact error text and any
self-test.txt result. Never send credentials or unrelated personal files.

## Integrity
The sibling .zip.sha256 file contains the ZIP's expected SHA-256. In PowerShell:
  Get-FileHash .\DIVIDED_HORIZON_Windows_Combat_Slice_0.3.1.zip -Algorithm SHA256
Compare that value with the published checksum before extracting.
SHA256SUMS.txt inside the ZIP lists hashes of its other files.
Checksums check integrity, not safety or gameplay quality.

## Source and production plan
The separately named Source ZIP includes code, model generators, v3 briefs and the
browser review page. It is not needed to play the Windows package. Follow
START_HERE_v3.md and docs/state/ for the unfinished UE production plan.
