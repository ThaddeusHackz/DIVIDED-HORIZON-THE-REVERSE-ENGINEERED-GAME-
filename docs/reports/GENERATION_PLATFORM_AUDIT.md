# Generation-platform capability and integration audit

Date: 2026-10-14
Scope: public vendor documentation, available Arena connector checks, and fit against the owner's v3 brief. **Not a penetration test, source-code security audit, hands-on generator benchmark, or certification of final quality.**

## Conclusion

The existing blockout assets are not the full requested game or final-quality content. A better pipeline is appropriate, but a single image/video generator is not evidence of rigged characters, navigable environments, or a shipping Unreal executable.

Recommended division of work (a project-fit recommendation, not a universal “most powerful” ranking):

1. Higgsfield or available image tools for original character concepts, lighting studies and cinematic previsualization.
2. MetaHuman plus custom character art and the evaluated Game Animation Sample for production humans and locomotion, as required by Ω.5/Ω.10.
3. Unreal world-building foundations specified in Ω.5 for the playable island/city: evaluated PCG/Electric Dreams, City Sample systems, licensed surface assets and original layouts.
4. Compare Meshy and Tripo only for permitted background props/clutter; validate and repair the actual exports before use.
5. Consider Marble as an isolated environment-research trial. Do not substitute a generated scene or Gaussian-splat preview for the Golden Slice acceptance gates.

## What was actually checked

| Check | Result | Evidence boundary |
|---|---|---|
| Arena Higgsfield connector lookup | Unsupported | No Higgsfield tools registered here |
| Arena ChatGPT connector lookup | Unsupported | This session cannot control the user's ChatGPT account through that connector |
| Arena Meshy, Tripo and World Labs connector lookups | Unsupported | Public API availability is not an active authenticated connection |
| Higgsfield official integration help | Retrieved and read relevant sections | Documented plugin/MCP/CLI workflows, not an account connection |
| Meshy official Text to 3D documentation | Retrieved and read relevant sections | Documented generation/export pipeline, not an exported asset test |
| World Labs official announcement and API documentation | Reviewed | Documented world exports, not UE import/performance verification |
| Epic MetaHuman documentation and City Sample overview | Reviewed via search excerpts | Production-workflow evidence, not an installed engine/sample |
| Tripo generation documentation and rigging/API reference | Reviewed via search excerpts | API feature evidence, not model-quality certification |

No accounts were created or connected, no credentials requested, no subscriptions purchased, no generation jobs submitted, and no paid credits consumed. No third-party site was vulnerability-scanned. Web research tools could retrieve official documentation; that does not grant this shell access to authenticated generation endpoints or a remote UE editor.

## Findings by role

| Candidate | Documented capability | Recommended use in this project | Remaining acceptance work |
|---|---|---|---|
| Higgsfield | Official ChatGPT plugin; MCP/CLI alternatives; image/video generation, Soul characters and reference Elements. Connected generation deducts credits. [2](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent) | Concept images, consistent visual references and shot studies | No evidence in the reviewed integration docs of rigged FBX/GLB character or complete playable-world exports. Do not call Soul image characters production skeletal meshes. |
| MetaHuman | In-engine character creation, face/body/hair/clothing/material controls and rigged assembly; integrated into Unreal starting with 5.6. [1](https://dev.epicgames.com/documentation/metahuman/metahuman-creator-in-unreal-engine?lang=en-US) [2](https://dev.epicgames.com/documentation/en-us/metahuman/creating-a-character) | Original Ren, El Sereno and other humans, following the v3 requirement | Installed-version compatibility, custom identity, groom/wardrobe, animation, facial performance, H7 likeness review and runtime cost remain untested. This is not a latest-engine-version claim. |
| Unreal / City Sample | Documented World Partition, Mass crowd/traffic, Chaos vehicles and MetaHuman crowd systems. [1](https://dev.epicgames.com/documentation/unreal-engine/city-sample-project-unreal-engine-demonstration) | Evaluate foundations; build original Meridian rather than ship the sample map | Licensed imports, original content, authored activities, navigation/collision, streaming and T1–T5 measurements |
| Meshy | Text-to-3D preview then texture refinement; GLB/FBX and other exports; PBR options. [1](https://docs.meshy.ai/en/api/text-to-3d) | Trial on one non-hero background prop | UV/texel density, topology, dimensions, material channels, collision, Nanite, licensing and visual defects require independent checks. Vendor “production-ready” wording is not our gate pass. |
| Tripo | Text/image model generation; separate auto-rig pipeline with GLB/FBX output and rig compatibility checks. [1](https://platform.tripo3d.ai/docs/generation) [2](https://developers.tripo3d.ai/en/docs/animations-rig) | Alternative trial for the same permitted prop, not the hero-human pipeline | Same geometry/material/legal gates; choose and verify one API version before integration rather than mixing legacy/v3 examples. No account rotation or credit-limit bypass. |
| World Labs Marble | Text/image/video/layout-to-world; Gaussian-splat, mesh and video exports; API includes mesh GLB export. [1](https://www.worldlabs.ai/blog/marble-world-model) [1](https://docs.worldlabs.ai/api) | A small environment R&D test, initially reference/blockout only | Independently test editable geometry, relighting, collision/navmesh, holes/occlusion, streaming, licenses and performance. A convincing camera path is not proof of gameplay support. |

## Higgsfield → ChatGPT: documented owner-side connection

Higgsfield's current instructions say to open `https://higgsfield.ai/mcp`, choose **Add Higgsfield plugin**, add it in ChatGPT, and sign in/authorize directly with Higgsfield. They require an active paid subscription. Menu availability on the owner's account was not tested. [2](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent)

Before requesting generation, use these instructions in that supported client:

> First check my credit balance and list recent generations. Do not generate, upload references, purchase credits or change my account settings yet. Before any generation, state the model, requested output, credit cost and retention/privacy implications, then wait for my approval. Use only original fictional designs, not real-person likenesses. Label images/videos as concepts—not rigged 3D models or playable game footage.

The vendor specifically recommends checking balance/recent generations to verify that tools are actually called, and asking for cost approval before generation. A text response claiming connection without a tool call is not verification. [2](https://higgsfield.ai/creator-hub/help-center/integrations/how-do-i-connect-higgsfield-to-ai-agent)

Do not paste passwords, OTPs, session cookies or API keys into this conversation. An integration authorized inside ChatGPT does not automatically authorize or install the same integration in Arena.

## Billing, versions and data handling

- Higgsfield's developer API is a separate billed product from its website subscription; the official current API help describes a prepaid US-dollar balance, while MCP/CLI use plan credits. Verify the correct product's costs before every integration decision. [4](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api)
- That API help says generated files remain available for at least seven days and can subsequently be removed. Copy accepted outputs into owner-controlled storage and record checksums; do not rely on a vendor URL as permanent asset storage. [4](https://higgsfield.ai/creator-hub/help-center/integrations/what-is-the-higgsfield-api)
- Meshy's current documentation marks its `lowpoly` model type as retiring October 30, 2026. Avoid implementing an old example unchanged; record the explicit supported model/version and output format when a trial is authorized. [1](https://docs.meshy.ai/en/api/text-to-3d)
- Provider output ownership, commercial use, reference-image rights, retention and training/privacy terms must be checked for the actual plan and assets. This audit does not certify them.
- Send only the minimum approved prompt/reference material. Do not upload the repository, private story library, credentials or all original art merely to connect a service.
- No paid trial budget is authorized here. Failed jobs, retries and texture/refine/export steps must count against any future approved cap; never retry paid submissions blindly.

## v3 compliance: requirements that a tool must not override

Local authorities: Ω.5, Ω.7, Ω.10, Ω.11, S104, S134 and S135 in the owner's supplied prompts.

- Production humans follow the MetaHuman/custom sculpt/groom/wardrobe/performance pipeline.
- Text/image-to-3D generation is allowed for props and background clutter only, never hero characters or hero props.
- Original fictional cast: no recognizable real-person likeness; consented/licensed voice sources only.
- AI assistance and asset provenance must be disclosed.
- Both Golden Slices must pass before final-art world scale-up. A third-party “generate world” feature does not waive this rule.
- Existing Batch 02 meshes remain placeholders. Approval of their design-test role is not approval of final fidelity.

## Small, measurable trial before any subscription or scale-up

Proposed trials; **not executed and not approved spending**:

1. **Original Ren design:** one original 2D concept for owner review, then a custom MetaHuman build on the provisioned engine host. Deliver both the concept and an actual in-engine character capture, explicitly distinguished. Test idle/walk, facial motion and likeness; no text-to-3D hero shortcut.
2. **One non-hero background prop:** use the same reference and scale requirements for Meshy/Tripo. Retain rejected results and actual cost. Download geometry, maps and provenance, not merely a turntable video. Compare silhouette from all sides, UVs, material response, texel density, normals, collision and editability. Stop after the approved batch/cost cap.
3. **One small environment test cell:** construct a native Unreal reference cell; optionally evaluate a Marble export as an isolated R&D comparison. Check visibility from off-reference viewpoints, relighting, collision, navmesh and editing. Do not expand it into the island/city before review.

Required handoff per accepted trial: actual asset files, source/provenance/license records, model/version and generation ID, input reference hashes, raw and repaired exports, file hashes, validation results, three in-engine lighting views where applicable, and a motion clip for animated work. Collect H7 feedback before another batch.

No candidate earns “highest quality” from a brochure. Selection depends on these observed results and the v3 gates, including actual UE rendering and target-hardware measurements.
