import './review.css';
const base = '/assets/batch-02/';
const names = {
  L_PuertoChico_Combat: ['Puerto Chico combat world', 'A layout for testing the three-objective mission. Repeated vegetation, simple water and lighting; not the final island.'],
  SM_Culebra_W01: ['W01 · Culebra', 'Pistol silhouette and scale study. No animated action, hands, material textures or production weapon rig.'],
  SM_Libertad_W05: ['W05 · Libertad', 'Rifle silhouette and scale study. No production rig, reload animation or detailed surface treatment.'],
  SM_Cosecha_Sentry_01: ['Cosecha sentry', 'Static placeholder for encounter readability. Not a MetaHuman, skinned character or final cast design.'],
  SM_SandbagCover_01: ['Sandbag cover', 'Low cover block for sightline tests. Cloth seams, folds, compression and material textures remain missing.'],
  SM_FieldGenerator_01: ['Field generator', 'Equipment blockout with grille and control shapes. Fine assemblies, labels, wear and PBR textures remain missing.'],
  SM_HarborContainer_01: ['Harbor container', 'Cover and scene-dressing blockout. Corrugation is modeled; material detail and production collision need work.'],
};
const element = (tag, text, cls) => { const e = document.createElement(tag); if (text) e.textContent = text; if (cls) e.className = cls; return e; };
try {
  const response = await fetch(`${base}manifest.json`);
  if (!response.ok) throw new Error('Asset manifest is unavailable');
  const manifest = await response.json();
  // Stable world-first ordering; retain manifest data and IDs unchanged.
  const assets = [...manifest.assets].sort((a, b) => Number(b.id.startsWith('L_')) - Number(a.id.startsWith('L_')));
  for (const asset of assets) {
    const [name, description] = names[asset.id] || [asset.id, manifest.status];
    const card = element('article', null, 'model'); card.dataset.id = asset.id;
    const pictureLink = element('a'); pictureLink.href = `${base}${asset.preview}`;
    const image = element('img'); image.src = pictureLink.href; image.alt = `Actual GLB render: ${name}`; image.width = 1080; image.height = 800;
    pictureLink.append(image); card.append(pictureLink);
    const content = element('div', null, 'model-content');
    content.append(element('div', `${asset.triangles.toLocaleString()} TRIANGLES · ${(asset.bytes / 1048576).toFixed(2)} MiB`, 'eyebrow'), element('h3', name), element('p', description));
    const links = element('div', null, 'links');
    for (const [label, path, download] of [['Model GLB ↓', `${base}${asset.file}`, true], ['Preview PNG ↓', `${base}${asset.preview}`, true], ['Open 3D scene ↗', `/?render=${encodeURIComponent(asset.id)}`, false]]) {
      const a = element('a', label); a.href = path; if (download) a.download = ''; links.append(a);
    }
    content.append(links); card.append(content); document.querySelector('#models').append(card);
  }
  document.querySelector('#status').textContent = `${assets.length} models ready for review. Structural checks do not certify final-art quality.`;
} catch (error) {
  document.querySelector('#status').textContent = `${error.message}. Refresh to retry.`;
}
