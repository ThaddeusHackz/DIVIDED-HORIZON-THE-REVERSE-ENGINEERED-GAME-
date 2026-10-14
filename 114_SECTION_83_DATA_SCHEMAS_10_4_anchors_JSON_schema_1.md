# SECTION 83 — DATA SCHEMAS (10.4 anchors — JSON, schema=1)
SCHEMA weapons.json: [{id,name,class,dmg,rpm,mag,reload,recoil_v,recoil_h,spread,ads,zones{head,torso,limb},falloff{a,b},ammo,price,unlock,feel_note,audio_id,anim_set}]
SCHEMA economy.json: {vendors:[{id,stock:[{item,price}]}],currencies,exchange,bugbuyback_s:60}
SCHEMA missions.json: {id,beats:[{id,text,cp,fail,five_moment?}],dialogue[],checkpoints[]}
SCHEMA contracts.json: {archetype,loc,mutators[],tier,seed,brief_text,obj[],timer?}
SCHEMA save schema=1: {schema:1,meta{ver,playtime,build},pos,rot,map,stats{xp,lvl,skills[],feats[]},inv{},vehicles_owned[],world{outposts{},alert{},heat,stature},quest{m_done[],beats{}},dog{bond,unlocked},settings_copy}
SCHEMA envstories.json: {op_id,distance,approach,interior,prop_ids[],audio_id}