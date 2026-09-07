export type Project = {
  title: string;
  slug: string;
  description?: string;
  location?: string;
  images: string[];
  beforeImages?: string[];
  afterImages?: string[];
};

export const projects: Project[] = [
  { title: 'Contemporary family bathroom', slug: 'contemporary-family-bathroom', description: 'A calm, practical room for daily life.', images: ['/images/projects/project-01.svg'] },
  { title: 'Walk-in shower', slug: 'walk-in-shower', description: 'Open, simple and considered.', images: ['/images/projects/project-02.svg'] },
  { title: 'Compact bathroom redesign', slug: 'compact-bathroom-redesign', description: 'Making a smaller room work harder.', images: ['/images/projects/project-03.svg'] },
  { title: 'Traditional bathroom', slug: 'traditional-bathroom', description: 'Classic proportions, carefully finished.', images: ['/images/projects/project-04.svg'] },
  { title: 'Ensuite transformation', slug: 'ensuite-transformation', description: 'A compact ensuite, made complete.', images: ['/images/projects/project-05.svg'] },
  { title: 'Tiled shower room', slug: 'tiled-shower-room', description: 'A clean, waterproofed shower space.', images: ['/images/projects/project-06.svg'] },
];
