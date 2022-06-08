type FooterTypes = {
  title: string;
  items: {
    name: string;
    url: string;
  }[];
}[];

const footerData: FooterTypes = [
  {
    title: 'Frameworks',
    items: [
      { name: 'Next.js', url: 'https://vercel.com/solutions/nextjs' },
      { name: 'Supabase', url: 'https://supabase.io/' },
      { name: 'Geist UI', url: 'https://geist-ui.dev/' },
      { name: 'React', url: 'https://reactjs.org/' },
    ],
  },
  {
    title: 'Resources',
    items: [
      { name: 'Documentation', url: 'https://github.com/harshcut/ultimo-pase/blob/main/README.md' },
      { name: 'Support', url: 'https://github.com/harshcut/ultimo-pase/issues' },
      { name: 'Issues', url: 'https://github.com/harshcut/ultimo-pase/issues' },
      { name: 'System Status', url: 'https://www.vercel-status.com/' },
    ],
  },
  {
    title: 'Source',
    items: [
      { name: 'GitHub', url: 'https://github.com/harshcut/ultimo-pase' },
      { name: 'Author', url: 'https://github.com/harshcut' },
      { name: 'Open Source', url: 'https://github.com/harshcut?tab=repositories' },
      { name: 'Twitter', url: 'https://twitter.com/harshcut_twt' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { name: 'License', url: 'https://github.com/harshcut/ultimo-pase/blob/main/LICENSE' },
      {
        name: 'Privacy Policy',
        url: 'https://github.com/harshcut/ultimo-pase/blob/main/supabase/scripts.md',
      },
    ],
  },
];

export default footerData;
