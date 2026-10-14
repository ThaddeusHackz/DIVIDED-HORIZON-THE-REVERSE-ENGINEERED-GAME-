# SECTION 108 — LIGHTING, TIME OF DAY & WEATHER

108.1 TIME OF DAY: 24 h cycle, 1 in-game hour = 2 real minutes default (user
      option 1–10 min). Sun/moon ephemeris for Isla Sombra latitude (11° N
      fictional), seasonal tilt fixed (equatorial rainy/dry mix). Moon phase
      cycle 12 days. Stars with correct density; Milky Way texture HDR.
108.2 WEATHER STATES (12, blendable over 90–300 s): Clear, Hazy, Partly Cloudy,
      Overcast, Drizzle, Rain, Storm (lightning), Tropical Squall, Fog/Mist,
      Heat Shimmer, Night Clear, Night Storm. Each defines sun intensity,
      cloud coverage/type, fog density, wind, wetness target, audio bed,
      VFX set, gameplay modifiers (visibility 44, noise masking 6.3, vehicle
      grip, NPC behavior) — table in Section 138.
108.3 EXPOSURE & GRADE: EV100 targets (noon clear 14.5, overcast 12.5, dusk
      8, night city 3–5, night jungle 0–1) with auto-exposure clamped to keep
      gameplay readable; HDR peak 1000–4000 nits configurable.
108.4 INTERIOR LIGHTING: motivated sources only (43.2), Lumen GI through
      windows, light shafts via volumetric fog, portal-less; interior/exterior
      exposure transition adaptive (1.2 s).
108.5 LIGHTNING & PYRO LIGHT: lightning = 3 flash strobes (photosens-safe
      alt 33), real sound propagation delay (distance/343 m/s); explosions and
      muzzle flashes emit dynamic light into Lumen with color temperature.
108.6 FIRE: Niagara + heterogeneous volume/sprite hybrid, emissive into Lumen,
      propagation rules (Section 120), wind-driven, smoke columns visible 2 km.
108.7 COLOR SCRIPTS: 43.1 palettes apply as LUT + light color grammar
      (e.g., Act II neon cyan/magenta). Grading never crushes blacks below
      0.02 or clips highlights except explosions; HDR-safe.
108.8 AUTOMATED LIGHTING QA: Section 138 grid renders each TOD×weather×zone
      camera and validates luminance histogram bands (no crushed/blown > 2%).
