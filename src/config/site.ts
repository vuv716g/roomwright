export const site = {
  name: 'Roomwright',
  owner: 'Harrison Herring',
  email: 'harrison@roomwright.co.uk',
  url: 'https://roomwright.co.uk',
  title: 'Roomwright | Bathroom Design & Installation',
  description:
    'Roomwright provides complete bathroom design and installation, including plumbing, electrical work, tiling, fitting and finishing. Contact Harrison Herring to discuss your bathroom project.',
} as const;

export const emailHref = `mailto:${site.email}`;
