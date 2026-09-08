export type Project = {
  title: string;
  slug: string;
  description?: string;
  location?: string;
  images: string[];
  beforeImages?: string[];
  afterImages?: string[];
};

const kingshillRougemont = '/images/kingshill-rougemont/';

export const projects: Project[] = [
  { title: 'Calm, considered ensuite', slug: 'calm-considered-ensuite', description: 'Soft neutrals, clean lines and carefully planned lighting.', images: [`${kingshillRougemont}PXL_20251213_144220990.jpg`] },
  { title: 'Walk-in shower', slug: 'walk-in-shower', description: 'A simple, open shower space with recessed storage.', images: [`${kingshillRougemont}PXL_20251213_142830820.jpg`] },
  { title: 'Integrated basin storage', slug: 'integrated-basin-storage', description: 'Wall-mounted storage and a quietly detailed basin area.', images: [`${kingshillRougemont}PXL_20251213_142741328.jpg`] },
  { title: 'Bathing space', slug: 'bathing-space', description: 'A compact bath area, finished in warm neutral tones.', images: [`${kingshillRougemont}PXL_20251213_143507687.jpg`] },
  { title: 'Cloakroom detail', slug: 'cloakroom-detail', description: 'Essential fixtures set into a clean, practical layout.', images: [`${kingshillRougemont}PXL_20251213_143018023.jpg`] },
  { title: 'Finishing details', slug: 'finishing-details', description: 'Tiling, lighting and fittings brought together with care.', images: [`${kingshillRougemont}PXL_20251213_143911896.jpg`] },
  { title: 'Fitted wardrobe storage', slug: 'fitted-wardrobe-storage', description: 'A made-to-measure wardrobe installation with hanging space, shelving and drawer storage.', images: ['/images/fitted-wardrobe-installation.png'] },
  { title: 'Bespoke outbuilding bar', slug: 'bespoke-outbuilding-bar', description: 'A made-to-measure outbuilding bar with curved slatted panelling, integrated lighting and air conditioning installed by Harrison.', images: ['/images/bespoke-outbuilding-bar-finished.png', '/images/bespoke-outbuilding-bar-in-progress.png'] },
  { title: 'Outbuilding deck & lighting', slug: 'outbuilding-deck-lighting', description: 'A finished outbuilding exterior with timber decking, exterior lighting and carefully detailed joinery.', images: ['/images/outbuilding-decking-exterior-lighting.png', '/images/outbuilding-decking-construction-wide.png', '/images/outbuilding-decking-construction-detail.png'] },
];