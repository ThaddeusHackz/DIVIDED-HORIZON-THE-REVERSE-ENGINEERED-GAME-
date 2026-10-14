# ADR 0004 — Owner-provisioned editor automation; no fictitious connection
Date: 2026-10-14 · Status: proposed, integration blocked by H1

Preferred first bridge: UnrealEditor-Cmd.exe plus the repository's Python preparation
script, invoked by `tools/unreal/build.ps1`. The manual Windows workflow is not
registered runner access and has not been dispatched. Build/cook/launch remains untested.

Use `python tools/build/preflight.py --require-ready` on the owner host to inventory
prerequisites first. Set UE_ROOT or copy env.example.json to ignored env.json. The
check is read-only and explicitly cannot certify licensing, compiler compatibility,
GPU capability, a booted game, or M0. Do not upload passwords, tokens or private keys.

Remote Control HTTP/WebSocket may be added after local editor scripting and capture
work. Keep it bound to the owner-local network; never expose an unauthenticated editor
to a public preview. No Unreal MCP connector is installed or claimed in this session.

Reviewed morluto/rea README via GitHub on 2026-10-14. It is reverse-engineering tooling,
not a hosted engine, renderer or licensed content source. No owned-binary investigation
requires it now; do not install it merely to claim “forensic” coverage.
