# SECTION 105 — LANDSCAPE & WORLD BUILDING (ISLA SOMBRA + MERIDIAN)

105.1 ISLA SOMBRA: 6 x 6 km footprint (36 km2) within a 10 x 10 km sea
      footprint. Elevation 0–520 m (Cresta Sombria ridge), volcanic core with a
      caldera lake (Laguna Quieta), 3 river systems, 11 waterfalls (4 jumpable),
      6 beaches, mangrove estuary, cloud forest above 300 m, 140 caves/overhangs
      (4 full cavern interiors), 2 sugar-mill valleys, cult hillside villages.
      Authored heightfield at 1 m/px (6,096 x 6,096 + 2 px border) in Gaea/
      World Creator/Houdini with erosion, then sculpt pass for hero vistas;
      Landscape with Nanite enabled; World Partition 256 m runtime cells,
      1 km HLOD tiles, OFPA (one file per actor).
105.2 LANDMARK LAW: every 500 m of travel presents a new readable landmark or
      vista; 4 Signal Masts visible from 70% of the island; lighthouse visible
      from the sea ring; silhouettes tested with 1-color-clay render.
105.3 BIOME TABLE (binding; drives PCG + audio + wildlife + weather):
      B01 Coral Beach · B02 Mangrove · B03 Lowland Rainforest · B04 Cloud Forest ·
      B05 Volcanic Ridge · B06 Sugar-Cane Fields · B07 River Gorge ·
      B08 Cult Village · B09 Cave Mouth · B10 Shallow Reef · B11 Deep Ocean ·
      B12 Caldera Lake.
105.4 PCG: Procedural Content Generation framework graphs place vegetation,
      rocks, debris, ruins, fences, cables, litter from biome + slope + wetness +
      proximity-to-path masks; hero dressing is hand-placed in a separate
      data layer. Density targets: rainforest 3,500 Nanite foliage instances/ha
      (5 layers: canopy, sub-canopy, shrub, ground-cover, litter), beach 400,
      cloud forest 2,800, cane fields 6,000 (stalks via ISM+WPO wind), cult
      village 900 props/ha. Performance gated by Section 109 instance budgets.
105.5 WIND: global wind vector field (from weather controller) drives foliage
      WPO (Nanite-compatible), cloth, flags, water surface, rain slant, audio
      (leaf rustle layers). Gusts propagate as traveling waves (visible across
      canopy). Per-species sway parameters in Section 140.
105.6 ROADS & PATHS: spline-deformed landscape (Landscape Patch) for roads,
      trails and river beds; RVT blend for asphalt edges, tire tracks; road
      furniture via PCG (signs, guardrails, bollards, litter).
105.7 OCEAN & ISLAND RING: 10x10 km ocean with shelf depth data, reef patches,
      wrecks (8), kelp/seagrass PCG, bioluminescent plankton at night (toggle),
      distant islets as HLOD backdrops (reachable by boat: 3).
105.8 CAVES & INTERIORS: four authored cavern levels (Cueva del Trueno, Bóveda
      Sumergida, Colina Hueca, Mina Vieja) streamed as sub-levels with
      volumetric fog, dripping audio, lightless-with-flashlight sections tuned
      for Lumen (emissive bounce minimum), bats Mass crowd.
