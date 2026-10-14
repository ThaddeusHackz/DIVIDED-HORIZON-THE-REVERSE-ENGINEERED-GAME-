# SECTION 82 — CORE ALGORITHMS (implement per pseudocode)

ENEMY FSM (6.4): states PATROL,SUSPICIOUS,SEARCH,COMBAT,FLEE,DEAD,DOWNED.
  on_perception(event): meter += weight(dist,light,stance,noise); SUSPICIOUS at 0.35; COMBAT at 0.8 or ally_call.
  SEARCH: sweep LKP (6.3) grid 3m; 2 probes then flank pick from cover_graph; morale<0.2 -> FLEE (faction matrix).
  reinforce(): nearest garrison waves 2 max (26.1) — route spawn_points, 25m min.
TRAFFIC GRAPH: nodes=intersections, edges=lanes(m); cars target speed=min(lane,curve); gap rule: keep 1.5s; panic impulse => scatter targets off-graph 8s then rejoin.
PEDESTRIAN GRAPH: sidewalks with interest nodes (shop,cafe,view); panic->nearest door; night weight to venues (46.1).
WAVES (45.1): H(p,t)=sum Ai*sin(wi*t+phi(p)); 3 Gerstner waves LOD by camera height (45.4).
CONTRACT SEED: seed=int(date.strftime('%Y%m%d'))*7+archetype_id; RNG=mulberry32(seed) (30 daily law: same day = same contract).
CITY GRAMMAR (4.2): blocks=grammar rules: [Ave]+[Block(g,w)] where g in {grid,radial,terrace}; hero blocks hand-pinned 30 (4.2); heights by district table; Alto Barro: terrace(min_lot 4x6m, stair 18%).
DETECTION METER (6.3): meter rate = base/(dist^2 * light * stance); decay 0.2/s; team share at 8m radius (shouts).
